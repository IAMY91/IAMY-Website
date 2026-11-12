"""Build complete static English pages from the German pages and reviewed copy.
Run: python3 scripts/build-english.py
Shared assets stay at the root; page links stay within /en/.
"""
from html.parser import HTMLParser
from html import escape
from pathlib import Path
import json,re,posixpath
ROOT=Path(__file__).resolve().parents[1]
COPY=json.loads((ROOT/'translations/en.json').read_text())
PAGES=['index.html','referenzen.html','ueber-mich.html','blog/index.html','blog/flow-und-potenzial.html','blog/regeneratives-leadership.html','blog/evolutionaere-organisationen.html','impressum.html','datenschutz.html']
ASSETS=('assets/','css/','js/','docs/','Bilder/')
class Translate(HTMLParser):
 def __init__(self,page):super().__init__(convert_charrefs=True);self.page=page;self.parts=[];self.skip=0;self.keep_language=False;self.language_depth=0
 def translate(self,s):
  norm=re.sub(r'\s+',' ',s).strip()
  if norm not in COPY:return s
  lead=s[:len(s)-len(s.lstrip())];tail=s[len(s.rstrip()):]
  return lead+COPY[norm]+tail
 def attrs(self,attrs):
  out=[];d=dict(attrs)
  for k,v in attrs:
   if v is None:out.append(k);continue
   if k in ['alt','aria-label','placeholder']:v=self.translate(v)
   if k=='content' and (d.get('name')=='description' or d.get('property') in ['og:title','og:description']):v=self.translate(v)
   if k=='lang' and v=='de':v='en'
   if k in ['src','href','srcset'] and not v.startswith(('#','/','https:','http:','mailto:','data:')):
    normalized=posixpath.normpath(posixpath.join(posixpath.dirname(self.page),v.split('?')[0].split('#')[0]))
    if normalized.startswith(ASSETS):v='../'+v
   out.append(f'{k}="{escape(v,quote=True)}"')
  return (' '+ ' '.join(out)) if out else ''
 def handle_starttag(self,t,attrs):
  if t=='nav' and dict(attrs).get('class')=='language-switch':self.keep_language=True
  # Language controls and alternate links are replaced separately below.
  if self.keep_language:
   self.language_depth+=1
   self.parts.append(self.get_starttag_text());return
  self.parts.append('<'+t+self.attrs(attrs)+'>')
  if t in ['script','style']:self.skip+=1
 def handle_startendtag(self,t,a):self.parts.append('<'+t+self.attrs(a)+' />')
 def handle_endtag(self,t):
  self.parts.append('</'+t+'>')
  if self.keep_language:
   self.language_depth-=1
   if self.language_depth==0:self.keep_language=False
   return
  if t in ['script','style']:self.skip-=1
 def handle_data(self,s):self.parts.append(s if self.skip or self.keep_language else escape(self.translate(s),quote=False))
 def handle_comment(self,s):self.parts.append('<!--'+s+'-->')
 def handle_decl(self,s):self.parts.append('<!'+s+'>')
def language_switch(page,lang):
 de='/'+page;en='/en/'+page
 def link(code,label,href):return f'<a href="{href}" lang="{code}" hreflang="{code}" data-language-link'+(' aria-current="page"' if code==lang else '')+'>'+label+'</a>'
 return '<nav class="language-switch" aria-label="'+('Language' if lang=='en' else 'Sprache')+'">'+link('de','DE',de)+'<span aria-hidden="true">/</span>'+link('en','ENG',en)+'</nav>'
def alternate_links(page):return '\n<link rel="alternate" hreflang="de" href="https://iamy-website.vercel.app/'+page+'" />\n<link rel="alternate" hreflang="en" href="https://iamy-website.vercel.app/en/'+page+'" />\n'
for page in PAGES:
 p=ROOT/page;s=p.read_text()
 s=re.sub(r'\n?<link rel="alternate"[^>]*>','',s)
 s=re.sub(r'<nav class="language-switch".*?</nav>',lambda m:language_switch(page,'de'),s,flags=re.S)
 if 'class="header-controls"' not in s:
  s=s.replace('    <button class="nav-toggle"','    <div class="header-controls">'+language_switch(page,'de')+'\n    <button class="nav-toggle"').replace('</button>\n  </div>\n</header>','</button></div>\n  </div>\n</header>')
 s=s.replace('</head>',alternate_links(page)+'</head>')
 p.write_text(s)
 parser=Translate(page);parser.feed(s);en=''.join(parser.parts)
 en=re.sub(r'<nav class="language-switch".*?</nav>',lambda m:language_switch(page,'en'),en,flags=re.S)
 # Avoid stale editorial image URLs; use the site's existing photograph.
 en=re.sub(r'<meta property="og:image"[^>]*>', '<meta property="og:image" content="https://iamy-website.vercel.app/assets/gallery/urban-future-facilitation.jpg">',en)
 en=en.replace('Coach, Facilitator und Senior Consultant für Organizational Change Management','Organizational Developer, Coach and Facilitator')
 # Structured data retains the same identity and contact details.
 dest=ROOT/'en'/page;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(en)
print('Built',len(PAGES),'English pages with matching DE/ENG links.')
