let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Dev/personal/doge-gram
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +56 components/Card/index.tsx
argglobal
%argdel
edit components/Card/index.tsx
set splitbelow splitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
argglobal
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=12
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
66
normal! zo
73
normal! zo
93
normal! zo
94
normal! zo
98
normal! zo
100
normal! zo
110
normal! zo
114
normal! zo
115
normal! zo
118
normal! zo
119
normal! zo
138
normal! zo
145
normal! zo
146
normal! zo
160
normal! zo
161
normal! zo
174
normal! zo
175
normal! zo
176
normal! zo
186
normal! zo
187
normal! zo
188
normal! zo
189
normal! zo
190
normal! zo
192
normal! zo
203
normal! zo
210
normal! zo
211
normal! zo
212
normal! zo
213
normal! zo
220
normal! zo
225
normal! zo
235
normal! zo
253
normal! zo
261
normal! zo
let s:l = 56 - ((14 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
56
normal! 028|
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
