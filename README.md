#stone editor
es6 문법으로 작성된 가벼운기능의 에디터입니다.
스톤에디터는 에디터 생성 명령어와 파라미터 두개면 충분합니다.

##시작하기
누구나 사용할 수 있고 쉽게 분석할 수 있도록 압축하지 않은 파일을 제공합니다.
다운로드하여 사용해주세요.

##적용하기
스톤에디터는 new_stone_editor 메소드 하나만 가지고 있습니다.
new_stone_editor 명령어에 에디터를 삽입할 요소의 선택자를 입력해주세요.

	new_stone_editor('선택자')

사용 할 수 있는에디터가 바로 생성됩니다.

##이미지 저장하기
new_stone_editor 메소드는 이미지를 저장하지 않습니다.
에디터에 나타나는 이미지는 blob 형태의 임시 주소를 가지고 표시됩니다.

만약 이미지를 저장할 서버와 메소드가 있다면 new_stone_editor 메소드의 두번째 인자로 전달해주세요.

	new_stone_editor('선택자',{ image_save: 전달받을 메소드})

이미지의 프리뷰가 작성되면 전달받을 메소드에 이미지파일과 타임스탬프가 json 포맷으로 전달됩니다.

각각의 데이터에는 이미지파일과 타임스탬프가 들어있습니다.

	const json_data = {
		image:image_file,
		timestamp:timestamp
	}
	json_datas.push(json_data);


image_save에 전달된 메소드로 json_datas를 전달하여 실행합니다.

	opt.image_save(json_datas);

전달한메소드에서는 각각의 타임스탬프와 이미지파일을 이용하여 서버에 저장하도록합니다.

전달한메소드의 예시는 전달받은 json_datas를 반복하여 각각의 파일을 서버로 전송하고,
전송이 완료된 후 '.stone-image-uploading[data-timestamp="${timestamp}"]' 선택자를 통해 요소를 찾은 후
stone-image-uploading 클래스와 data-timestamp를 삭제했습니다.
클래스와 데이터속성은 삭제하지 않아도 괜찮습니다.

적용 예시:

	function 전달한메소드(json_datas){
		for(let i=0; i<json_datas.length; i++){
			let timestamp = json_datas[i].timestamp;
			let form_data = new FormData();
			form_data.append('image',json_datas[i].image);
			form_data.append('timestamp',timestamp);
	.
	. 서버에 저장하는 코드
	.
	let uploading_image = document.querySelector(`.stone-image-uploading[data-timestamp="${timestamp}"]`)
	uploading_image.classList.remove('stone-image-uploading');
	uploading_image.removeAttribute('data-timestamp');
	uploading_image.src = `서버에서 받은 실제 파일주소`;

##라이선스
MIT