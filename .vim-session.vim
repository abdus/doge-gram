let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Dev/personal/doge-gram
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +55 components/Image/index.tsx
badd +32 components/Image/Image.module.css
argglobal
%argdel
edit components/Image/index.tsx
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
setlocal fdl=7
setlocal fml=1
setlocal fdn=20
setlocal fen
13
normal! zo
23
normal! zo
24
normal! zo
25
normal! zo
37
normal! zo
38
normal! zo
56
normal! zo
73
normal! zo
74
normal! zo
78
normal! zo
79
normal! zo
let s:l = 69 - ((44 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
69
normal! 031|
wincmd w
argglobal
if bufexists("components/Image/Image.module.css") | buffer components/Image/Image.module.css | else | edit components/Image/Image.module.css | endif
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=1
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 29 - ((28 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
29
normal! 03|
wincmd w
2wincmd w
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
