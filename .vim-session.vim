let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Dev/personal/doge-gram
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 components/Card/index.tsx
badd +80 components/Card/Card.module.css
argglobal
%argdel
edit components/Card/index.tsx
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 119 + 119) / 239)
exe 'vert 2resize ' . ((&columns * 119 + 119) / 239)
argglobal
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=8
setlocal fml=1
setlocal fdn=20
setlocal fen
35
normal! zo
48
normal! zo
49
normal! zo
51
normal! zo
63
normal! zo
90
normal! zo
97
normal! zo
117
normal! zo
118
normal! zo
122
normal! zo
124
normal! zo
134
normal! zo
138
normal! zo
139
normal! zo
142
normal! zo
143
normal! zo
145
normal! zo
145
normal! zo
150
normal! zo
151
normal! zo
165
normal! zo
166
normal! zo
179
normal! zo
180
normal! zo
181
normal! zo
191
normal! zo
192
normal! zo
193
normal! zo
194
normal! zo
195
normal! zo
197
normal! zo
198
normal! zo
208
normal! zo
216
normal! zo
217
normal! zo
218
normal! zo
219
normal! zo
220
normal! zo
226
normal! zo
227
normal! zo
231
normal! zo
234
normal! zo
241
normal! zo
242
normal! zo
259
normal! zo
267
normal! zo
let s:l = 267 - ((14 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
267
normal! 026|
wincmd w
argglobal
if bufexists("components/Card/Card.module.css") | buffer components/Card/Card.module.css | else | edit components/Card/Card.module.css | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 80 - ((43 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
80
normal! 015|
wincmd w
exe 'vert 1resize ' . ((&columns * 119 + 119) / 239)
exe 'vert 2resize ' . ((&columns * 119 + 119) / 239)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFA
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
