let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Dev/personal/doge-gram
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +47 components/Card/index.tsx
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
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
35
normal! zo
47
normal! zo
52
normal! zo
53
normal! zo
55
normal! zo
56
normal! zo
70
normal! zo
71
normal! zo
77
normal! zo
79
normal! zo
80
normal! zo
97
normal! zo
98
normal! zo
99
normal! zo
257
normal! zo
259
normal! zo
261
normal! zo
265
normal! zo
275
normal! zo
280
normal! zo
285
normal! zo
290
normal! zo
295
normal! zo
300
normal! zo
305
normal! zo
310
normal! zo
315
normal! zo
320
normal! zo
325
normal! zo
330
normal! zo
335
normal! zo
340
normal! zo
345
normal! zo
350
normal! zo
let s:l = 49 - ((28 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
49
normal! 0
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
