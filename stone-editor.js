function stone_editor_init(el,opt){
    let is_focus = false;

    const exit_el = el.querySelector('.stone-exit');
    const content = el.querySelector('.stone-content');
    content.addEventListener('keydown',e=>{
        if(e.key && e.key === 'Escape'){
            exit_el.focus();
        }
        if(e.key && e.key === 'Tab'){
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
            return
        }
    })
    content.addEventListener('keyup',clone_content);
    content.addEventListener('click',image_alt_edit);
    content.addEventListener('focus',()=>{is_focus = true});
    content.addEventListener('focusout',()=>{is_focus = false});
    const html_content = el.querySelector('.stone-html-content');
    html_content.addEventListener('keyup',clone_html_content);
    if(opt.heading != false){
        const heading_btns = el.querySelectorAll('.stone-heading');
        for(let i=0; i<heading_btns.length; i++){
            heading_btns[i].addEventListener('click', heading)
        }
    }
    if(opt.font_size != false){
        const font_size_btns = el.querySelectorAll('.stone-font-size');
        for(let i=0; i<font_size_btns.length; i++){
            font_size_btns[i].addEventListener('click', font_size)
        }
    }
    if(opt.color != false){
        const color_input = el.querySelector('.stone-color-input');
        const hilite_input = el.querySelector('.stone-hilite-input');
        const color_btn = el.querySelector('.stone-color');
        color_btn.addEventListener('click',color);
        color_btn.querySelector('i').style.color = color_input.value;
        const hilite_btn = el.querySelector('.stone-hilite');
        hilite_btn.addEventListener('click',hilite);
        hilite_btn.querySelector('i').style.color = hilite_input.value;
    }
    if(opt.font_style != false){
        const bold_btn = el.querySelector('.stone-bold');
        bold_btn.addEventListener('click',bold);
        const italic_btn = el.querySelector('.stone-italic');
        italic_btn.addEventListener('click',italic);
        const underline_btn = el.querySelector('.stone-underline');
        underline_btn.addEventListener('click',underline);
        const stroke_btn = el.querySelector('.stone-stroke');
        stroke_btn.addEventListener('click',stroke);
    }
    if(opt.list != false){
        const unorderd_list_btn = el.querySelector('.stone-ul');
        unorderd_list_btn.addEventListener('click',unorderdList)
        const orderd_list_btn = el.querySelector('.stone-ol');
        orderd_list_btn.addEventListener('click',orderdList);
    }
    if(opt.align != false){
        const align_btns = el.querySelectorAll('.stone-align');
        for(let i=0; i<align_btns.length; i++){
            align_btns[i].addEventListener('click', align)
        }
    }
    if(opt.attachment != false){
        const link_btn = el.querySelector('.stone-link');
        link_btn.addEventListener('click',link);
        const image_btn = el.querySelector('.stone-image');
        image_btn.addEventListener('click',stone_image_input_create);
        const video_btn = el.querySelector('.stone-video');
        video_btn.addEventListener('click',video);
    }
    const html_check = el.querySelector('.stone-html-check');
    if(opt.html != false){
        html_check.addEventListener('click',html_edit);
    }

    function heading(e) {
        let heading = e.currentTarget.dataset.heading;
        document.execCommand('formatBlock', false, `<${heading}>`)
    }

    function font_size(e) {
        let font_size = e.currentTarget.dataset.fontSize;
        let selObj = window.getSelection();
        let selectedText = selObj.toString();
        if(selectedText){
            document.execCommand('insertHTML',false,`<span style="font-size:${font_size}">${selectedText}</span>`);
        }
    }

    function color(){
        document.execCommand('foreColor',false,color_input.value)
    }

    function hilite(){
        document.execCommand('hiliteColor',false,hilite_input.value)
    }

    function bold(){
        document.execCommand('bold');
    }

    function italic(){
        document.execCommand('italic');
    }

    function underline(){
        document.execCommand('underline');
    }

    function stroke(){
        document.execCommand('strikeThrough');
    }

    function unorderdList(){
        document.execCommand('insertUnorderedList')
    }

    function orderdList(){
        document.execCommand('insertOrderedList')
    }

    function align(e){
        let align = e.currentTarget.dataset.align;
        switch (align) {
            case "left":
                document.execCommand('justifyLeft');
                break;
            case "center":
                document.execCommand('justifyCenter');
                break;
            case "right":
                document.execCommand('justifyRight');
                break;
            default:
                return false;
        }
    }

    function link(){
        const selObj = window.getSelection();
        const selectedText = selObj.toString();
        if (selectedText == "") {
            let url = prompt("사이트 URL을 입력하세요.");
            if (url != "" && url != null) {
                document.execCommand('insertHTML', false, `<a href="http://${url}" target="_blank" title="${url}">${url}</a>`);
            }
        } else {
            let url = prompt("사이트 URL을 입력하세요.");
            if (url != "" && url != null) {
                document.execCommand('insertHTML', false, `<a href="http://${url}" target="_blank" title="${url}">${selectedText}</a>`);
            }
        }
    }
    
    function stone_image_input_create() {
        const temp_input = document.querySelector('.stone-temp-image-input');
        temp_input && temp_input.remove();

        let image_input = document.createElement('input');
        image_input.setAttribute('type', 'file');
        image_input.setAttribute('accept', '.gif, .jpg, .png, .jpeg');
        image_input.setAttribute('class', 'stone-temp-image-input stone-hide');
        image_input.setAttribute('multiple', true);
        document.body.append(image_input); // for ios
        image_input.click();
        image_input.addEventListener("change", function () {
            const image_files = this.files;
            if(opt.image_save == undefined){
                stone_preview_image(image_files)
            }else{
                stone_preview_image_save(image_files);
            }
        })
    }

    function stone_preview_image(files) {
        if(is_focus == false){
            content.focus();
        }
        for (let i=0; i < files.length; i++) {
            let src = URL.createObjectURL(files[i]);
            document.execCommand('insertImage',false,src);
        }
    }
    
    function stone_preview_image_save(files){
        if(is_focus == false){
            content.focus();
        }
        let json_datas = [];
        for (let i=0; i<files.length; i++) {
            const image_file = files[i];
            let src = URL.createObjectURL(image_file);
            const timestamp = +new Date() + i;
            const stone_img = `<img src="${src}" alt="" class="stone-image-uploading" data-timestamp="${timestamp}">`
            document.execCommand('insertHTML', false, stone_img);
            const json_data = {
                image:image_file,
                timestamp:timestamp
            }
            json_datas.push(json_data);
        }
        opt.image_save(json_datas);
    }

    function image_alt_edit(e){
        const old_textarea = document.querySelector('.stone-image-alt');
        old_textarea && old_textarea.remove();
        if(e.target.tagName === 'IMG'){
            e.target.classList.add('stone-alt-editing')
            let textarea = document.createElement('textarea');
            textarea.setAttribute('class','stone-image-alt');
            textarea.setAttribute('placeholder','이미지 설명글');
            textarea.innerText = e.target.alt;
            textarea.addEventListener('focusout',image_alt_change)
            textarea.addEventListener('keydown',image_alt_auto_height)
            textarea.addEventListener('keyup',image_alt_auto_height)
            e.target.after(textarea);
            let textarea_height = textarea.scrollHeight;
            textarea.style.height = textarea_height + 'px';
            textarea.focus()
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }

    function image_alt_auto_height(e){
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    function image_alt_change(e){
        let text_content = e.target.value;
        let alt_editing = content.querySelector('.stone-alt-editing')
        alt_editing.alt = text_content
        alt_editing.classList.remove('stone-alt-editing')
        const old_textarea = document.querySelector('.stone-image-alt');
        old_textarea && old_textarea.remove();
    }

    function video(){
        let url = prompt("비디오 링크를 입력하세요. 유튜브, 비메오 가능");
        if (url != "" && url != null) {
            url = url.replace("https://youtu.be/", "https://www.youtube.com/embed/");
            url = url.replace("watch?v=", "embed/");
            url = url.replace('https://vimeo.com', 'https://player.vimeo.com/video');
            if(is_focus == false){
                content.focus();
            }
            document.execCommand('insertHTML', false, `<iframe title="video player" src="${url}" frameborder="0" allowfullscreen="true" onload="calc_stone_iframe_height(this)"></iframe>`);
        }
    }

    function clone_content(){
        const content_inner_html = content.innerHTML;
        html_content.value = content_inner_html;
    }

    function clone_html_content(){
        const html_content_inner_text = html_content.value;
        content.innerHTML = html_content_inner_text;
    }

    function html_edit(){
        if(html_check.checked){
            clone_content();
            html_content.classList.remove('stone-hide');
        }else{
            clone_html_content();
            html_content.classList.add('stone-hide');
        }
    }

    window.addEventListener('resize',calc_all_stone_iframe_height)
}

function calc_all_stone_iframe_height(){
    const stone_editors = document.querySelectorAll('.stone-editor');
    for(let i=0; i<stone_editors.length; i++){
        const iframes = stone_editors[i].querySelectorAll('iframe');
        for(let j=0; j<iframes.length; j++){
            iframes[j].style.height = (iframes[j].offsetWidth * 0.5625) + 'px';
        }
    }
}

function calc_stone_iframe_height(e){
    e.style.height = (e.offsetWidth * 0.5625) + 'px';
    e.removeAttribute('onload');
}

function new_stone_editor(selector,opt = {}) {
    let el = document.querySelector(`${selector}`);
    let inner_content = el.innerHTML;
    let stone_responsive = ``;
    if(opt.responsive != false){
        stone_responsive = `stone-responsive`
    }
    let stone_editor_toobar = ``;
    if(opt.heading != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_heading_group
    }
    if(opt.font_size != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_font_size_group
    }
    if(opt.color != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_color_group
    }
    if(opt.font_style != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_font_style_group
    }
    if(opt.list != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_list_group
    }
    if(opt.align != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_align_group
    }
    if(opt.attachment != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_attachment_group
    }
    if(opt.html != false){
        stone_editor_toobar = stone_editor_toobar + stone_editor_html_group
    }


    const stone_editor_layout = `
    <div class="stone-editor ${stone_responsive}" title="ESC키로 종료할 수 있습니다.">
        <div class="stone-toolbar">${stone_editor_toobar}</div>
        <div class="stone-content-wrap">
            <div class="stone-content" contentEditable="true">${inner_content}</div>
            <textarea class="stone-html-content stone-hide"></textarea>
        </div>
    </div>
    <input class=stone-exit>`

    el.innerHTML = stone_editor_layout;
    stone_editor_init(el,opt);
}

const stone_editor_heading_group = `<span class="stone-btn stone-heading-group">
    <button class="stone-pr2">
        Heading
        <svg viewBox="0 0 18 18">
            <polygon points="7 11 9 13 11 11 7 11"></polygon>
            <polygon points="7 7 9 5 11 7 7 7"></polygon>
        </svg>
    </button>
    <ul class="stone-btn-list">
        <li>
            <span class="stone-btn">
                <button class="stone-heading" data-heading="h1">
                    <h1>Heading1</h1>
                </button>
            </span>
        </li>
        <li>
            <span class="stone-btn">
                <button class="stone-heading" data-heading="h2">
                    <h2>Heading2</h2>
                </button>
            </span>
        </li>
        <li>
            <span class="stone-btn">
                <button class="stone-heading" data-heading="h3">
                    <h3>Heading3</h3>
                </button>
            </span>
        </li>
        <li>
            <span class="stone-btn">
                <button class="stone-heading" data-heading="h4">
                    <h4>Heading4</h4>
                </button>
            </span>
        </li>
        <li>
            <span class="stone-btn">
                <button class="stone-heading" data-heading="h5">
                    <h5>Heading5</h5>
                </button>
            </span>
        </li>
        <li>
            <span class="stone-btn">
                <button class="stone-heading" data-heading="h6">
                    <h6>Heading6</h6>
                </button>
            </span>
        </li>
    </ul>
</span>`
const stone_editor_font_size_group = `<span class="stone-btn stone-font-size-group">
<button class="stone-pr2">
    Font size
    <svg viewBox="0 0 18 18">
        <polygon points="7 11 9 13 11 11 7 11"></polygon>
        <polygon points="7 7 9 5 11 7 7 7"></polygon>
    </svg>
</button>
<ul class="stone-btn-list">
    <li>
        <span class="stone-btn">
            <button class="stone-font-size" data-font-size="2.5em">
                <span style="font-size:2.5em">2.5em</span>
            </button>
        </span>
    </li>
    <li>
        <span class="stone-btn">
            <button class="stone-font-size" data-font-size="2em">
                <span style="font-size:2em">2em</span>
            </button>
        </span>
    </li>
    <li>
        <span class="stone-btn">
            <button class="stone-font-size" data-font-size="1.75em">
                <span style="font-size:1.75em">1.75em</span>
            </button>
        </span>
    </li>
    <li>
        <span class="stone-btn">
            <button class="stone-font-size" data-font-size="1.5em">
                <span style="font-size:1.5em">1.5em</span>
            </button>
        </span>
    </li>
    <li>
        <span class="stone-btn">
            <button class="stone-font-size" data-font-size="1.25em">
                <span style="font-size:1.25em">1.25em</span>
            </button>
        </span>
    </li>
    <li>
        <span class="stone-btn">
            <button class="stone-font-size" data-font-size="1em">
                <span style="font-size:1em">1em</span>
            </button>
        </span>
    </li>
</ul>
</span>`
const stone_editor_color_group = `<span class="stone-btn stone-color-group">
<button class="stone-color" title="글자색"><i class="fas fa-font"></i></button>
</span>
<span class="stone-btn stone-color-group stone-flex">
<input type="color" class="stone-color-input" value="#444444">
</span>
<span class="stone-btn stone-color-group">
<button class="stone-hilite" title="배경색"><i class="fas fa-fill-drip"></i></button>
</span>
<span class="stone-btn stone-color-group stone-flex">
<input type="color" class="stone-hilite-input" value="#444444">
</span>`
const stone_editor_font_style_group = `<span class="stone-btn stone-font-style-group">
<button class="stone-bold" title="굵게"><i class="fas fa-bold"></i></button>
</span>
<span class="stone-btn stone-font-style-group">
<button class="stone-italic" title="기울임"><i class="fas fa-italic"></i></button>
</span>
<span class="stone-btn stone-font-style-group">
<button class="stone-underline" title="밑줄"><i class="fas fa-underline"></i></button>
</span>
<span class="stone-btn stone-font-style-group">
<button class="stone-stroke" title="취소선"><i class="fas fa-strikethrough"></i></button>
</span>`
const stone_editor_list_group = `<span class="stone-btn stone-list-group">
<button class="stone-ul" title="순서없는 리스트"><i class="fas fa-list-ul"></i></button>
</span>
<span class="stone-btn stone-list-group">
<button class="stone-ol" title="순서있는 리스트"><i class="fas fa-list-ol"></i></button>
</span>`
const stone_editor_align_group = `<span class="stone-btn stone-align-group">
<button title="문단 정렬"><i class="fas fa-align-left"></i></button>
<ul class="stone-btn-list">
    <li>
        <span class="stone-btn">
            <button class="stone-align" data-align="left" title="왼쪽 정렬"><i
                    class="fas fa-align-left"></i></button>
        </span>
    </li>
    <li>
        <span class="stone-btn">
            <button class="stone-align" data-align="center" title="가운데 정렬"><i
                    class="fas fa-align-center"></i></button>
        </span>
    </li>
    <li>
        <span class="stone-btn">
            <button class="stone-align" data-align="right" title="오른쪽 정렬"><i
                    class="fas fa-align-right"></i></button>
        </span>
    </li>
</ul>
</span>`
const stone_editor_attachment_group = `<span class="stone-btn stone-attachment-group">
<button class="stone-link" title="링크"><i class="fas fa-link"></i></button>
</span>
<span class="stone-btn stone-attachment-group">
<button class="stone-image" title="이미지 삽입"><i class="far fa-image"></i></button>
</span>
<span class="stone-btn stone-attachment-group">
<button class="stone-video" title="동영상 링크 삽입"><i class="fas fa-film"></i></button>
</span>`
const stone_editor_html_group = `<span class="stone-btn stone-html-group">
<button class="stone-html" title="HTML 편집"><label class="stone-html-check-label"><input type="checkbox"
            class="stone-html-check">HTML</label></button>
</span>`