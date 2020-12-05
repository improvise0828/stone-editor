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
    content.addEventListener('click',image_alt);
    content.addEventListener('focus',()=>{is_focus = true});
    content.addEventListener('focusout',()=>{is_focus = false});
    const html_content = el.querySelector('.stone-html-content');
    html_content.addEventListener('keyup',clone_html_content);
    const heading_btns = el.querySelectorAll('.stone-heading');
    for(let i=0; i<heading_btns.length; i++){
        heading_btns[i].addEventListener('click', heading)
    }
    const font_size_btns = el.querySelectorAll('.stone-font-size');
    for(let i=0; i<font_size_btns.length; i++){
        font_size_btns[i].addEventListener('click', font_size)
    }
    const color_input = el.querySelector('.stone-color-input');
    const color_btn = el.querySelector('.stone-color');
    color_btn.addEventListener('click',color);
    color_btn.querySelector('i').style.color = color_input.value;
    const hilite_btn = el.querySelector('.stone-hilite');
    hilite_btn.addEventListener('click',hilite);
    hilite_btn.querySelector('i').style.color = color_input.value;
    const bold_btn = el.querySelector('.stone-bold');
    bold_btn.addEventListener('click',bold);
    const italic_btn = el.querySelector('.stone-italic');
    italic_btn.addEventListener('click',italic);
    const underline_btn = el.querySelector('.stone-underline');
    underline_btn.addEventListener('click',underline);
    const stroke_btn = el.querySelector('.stone-stroke');
    stroke_btn.addEventListener('click',stroke);
    const unorderd_list_btn = el.querySelector('.stone-ul');
    unorderd_list_btn.addEventListener('click',unorderdList)
    const orderd_list_btn = el.querySelector('.stone-ol');
    orderd_list_btn.addEventListener('click',orderdList);
    const align_btns = el.querySelectorAll('.stone-align');
    for(let i=0; i<align_btns.length; i++){
        align_btns[i].addEventListener('click', align)
    }
    const link_btn = el.querySelector('.stone-link');
    link_btn.addEventListener('click',link);
    const image_btn = el.querySelector('.stone-image');
    image_btn.addEventListener('click',stone_image_input_create);
    const video_btn = el.querySelector('.stone-video');
    video_btn.addEventListener('click',video);
    const html_check = el.querySelector('.stone-html-check');
    html_check.addEventListener('click',html_edit);

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
        document.execCommand('hiliteColor',false,color_input.value)
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

    function image_alt(e){
        const old_textarea = document.querySelector('.stone-image-alt');
        old_textarea && old_textarea.remove();
        let posX = e.clientX;
        let posY = e.clientY;
        if(e.target.tagName === 'IMG'){
            e.target.classList.add('stone-alt-editing')
            let textarea = document.createElement('textarea');
            textarea.setAttribute('class','stone-image-alt');
            textarea.setAttribute('placeholder','description');
            textarea.setAttribute('style',`top:${posY}px; left:${posX}px`);
            textarea.innerText = e.target.alt;
            textarea.addEventListener('focusout',image_alt_change)
            document.body.appendChild(textarea);
            textarea.focus();
        }
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
            document.execCommand('insertHTML', false, `<iframe title="video player" src="${url}" width="560" frameborder="0" height="315" allowfullscreen="true"></iframe>`);
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
}


function new_stone_editor(selector,opt = {}) {
    let el = document.querySelector(`${selector}`);
    el.innerHTML = stone_editor_html;
    stone_editor_init(el,opt);
}

const stone_editor_html = `<div class="stone-editor">
    <div class="stone-toolbar">
        <span class="stone-btn">
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
        </span>
        <span class="stone-btn">
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
                        <button class="stone-font-size" data-font-size="2.5rem">
                            <span style="font-size:2.5rem">font size <small>(2.5rem)</small></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="stone-btn">
                        <button class="stone-font-size" data-font-size="2rem">
                            <span style="font-size:2rem">font size <small>(2rem)</small></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="stone-btn">
                        <button class="stone-font-size" data-font-size="1.75rem">
                            <span style="font-size:1.75rem">font size <small>(1.75rem)</small></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="stone-btn">
                        <button class="stone-font-size" data-font-size="1.5rem">
                            <span style="font-size:1.5rem">font size <small>(1.5rem)</small></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="stone-btn">
                        <button class="stone-font-size" data-font-size="1.25rem">
                            <span style="font-size:1.25rem">font size <small>(1.25rem)</small></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="stone-btn">
                        <button class="stone-font-size" data-font-size="1rem">
                            <span style="font-size:1rem">font size <small>(1rem)</small></span>
                        </button>
                    </span>
                </li>
            </ul>
        </span>
        <span class="stone-btn">
            <button class="stone-color" title="글자색"><i class="fas fa-font"></i></button>
        </span>
        <span class="stone-btn">
            <input type="color" class="stone-color-input" value="#444444">
        </span>
        <span class="stone-btn">
            <button class="stone-hilite" title="배경색"><i class="fas fa-fill-drip"></i></button>
        </span>
        <span class="stone-btn">
            <input type="color" class="stone-hilite-input" value="#444444">
        </span>
        <span class="stone-btn">
            <button class="stone-bold" title="굵게"><i class="fas fa-bold"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-italic" title="기울임"><i class="fas fa-italic"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-underline" title="밑줄"><i class="fas fa-underline"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-stroke" title="취소선"><i class="fas fa-strikethrough"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-ul" title="순서없는 리스트"><i class="fas fa-list-ul"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-ol" title="순서있는 리스트"><i class="fas fa-list-ol"></i></button>
        </span>
        <span class="stone-btn">
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
        </span>
        <span class="stone-btn">
            <button class="stone-link" title="링크"><i class="fas fa-link"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-image" title="이미지 삽입"><i class="far fa-image"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-video" title="동영상 링크 삽입"><i class="fas fa-film"></i></button>
        </span>
        <span class="stone-btn">
            <button class="stone-html" title="HTML 편집"><label class="stone-html-check-label"><input type="checkbox" class="stone-html-check">HTML</label></button>
        </span>
    </div>
    <div class="stone-content-wrap">
        <div class="stone-content" contentEditable="true"></div>
        <textarea class="stone-html-content stone-hide"></textarea>
    </div>
</div>
<input class=stone-exit>`;