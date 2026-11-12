"""Check static bilingual navigation, markup and assets without a browser."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Page(HTMLParser):
 def __init__(self,text):self.ids=[];self.links=[];self.h1=0;self.lang=None;self.switches=[];self.stack=[];super().__init__();self.feed(text)
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='html':self.lang=attrs.get('lang')
  if 'id' in attrs:self.ids.append(attrs['id'])
  if tag=='h1':self.h1+=1
  for key in ['href','src','srcset']:
   if attrs.get(key):self.links.append(attrs[key])
  if 'data-language-link' in attrs:self.switches.append(attrs)
  if tag not in VOID:self.stack.append(tag)
 def handle_endtag(self,tag):
  if tag in VOID:return
  assert self.stack and self.stack[-1]==tag, f'Mismatched {tag}; open tags: {self.stack[-5:]}'
  self.stack.pop()
ROOT=Path(__file__).resolve().parents[1]
NAMES=['index.html','referenzen.html','ueber-mich.html','impressum.html','datenschutz.html','blog/index.html','blog/flow-und-potenzial.html','blog/regeneratives-leadership.html','blog/evolutionaere-organisationen.html']
for name in NAMES+['en/'+x for x in NAMES]:
 path=ROOT/name
 try:page=Page(path.read_text())
 except AssertionError as err:raise AssertionError(f'{name}: {err}') from err
 assert not page.stack,(name,page.stack)
 assert page.h1==1,(name,'h1 count')
 assert len(page.ids)==len(set(page.ids)),(name,'duplicate IDs')
 assert len(page.switches)==2,(name,'language switch')
 lang='en' if name.startswith('en/') else 'de'
 assert page.lang==lang,(name,'document language')
 assert len([x for x in page.switches if x.get('aria-current')=='page' and x.get('lang')==lang])==1
 for value in page.links:
  url=urlparse(value)
  if url.scheme or url.netloc:continue
  target=ROOT/unquote(url.path).lstrip('/') if url.path.startswith('/') else ((path.parent/unquote(url.path)).resolve() if url.path else path)
  if target.is_dir():target=target/'index.html'
  assert target.exists(),(name,'missing asset or link',value)
  if url.fragment and target.suffix=='.html':assert url.fragment in Page(target.read_text()).ids,(name,'missing anchor',value)
 # Matching language pages must expose the same anchors.
 if lang=='de':assert set(page.ids)==set(Page((ROOT/'en'/name).read_text()).ids),(name,'anchor mismatch')
print('PASS: 18 pages; valid nesting, language attributes, matching language links and anchors, all local assets, unique IDs, single h1.')
