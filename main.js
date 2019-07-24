const socket = io('https://stream2407.herokuapp.com');
$('#div-chat').hide();

socket.on('Danh_sach_online', arruserInfo =>{
	$('#div-chat').show();
	$('#div-dang-ky').hide();
	arruserInfo.forEach(user =>{
		const {ten, peerId} = user;
		$('#ulUser').append(`<li id ="${peerId}">${ten}</li>`);
	});
	socket.on('co_nguoi_dung_moi', user =>{
	const {ten, peerId} = user;
		$('#ulUser').append(`<li id ="${peerId}">${ten}</li>`);
	});
  socket.on('ai_do_ngat_ket_noi', peerId =>{
    $(`#${peerId}`).remove();
  });
});
socket.on('dang_ky_that_bai',()=>{
	alert('username da co nguoi ky');
});
function openStream(){
  const config = {audio: false, video: true};
  return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag,stream){
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}
// openStream()
// .then(stream => playStream('localStream',stream));
const peer = new Peer({key: 'lwjd5qra8257b9'});
peer.on('open', id =>{
	$('#mypeer').append(id);
	$('#btnSignUp').click(() => {
	const username = $('#txtUsername').val();
	socket.emit('Nguoi_dung_dang_ky', {ten: username, peerId: id});
});
});
//
$('#btnCall').click(() => {
  const id = $('#remoteId').val();
  openStream().then(stream => {
    playStream('localStream', stream);

    const call =  peer.call(id, stream);
    // khi mở ra stream sẽ có đc cái remoteStream và lắng nghe stream đó
    call.on('stream',remoteStream => playStream('remoteStream', remoteStream));
  });
});
 // người nhận lắng nghe khi có ai gọi tới mình open Stream document.removeAttribute('attr');
peer.on('call', call =>{
  openStream().then(stream => {
    call.answer(stream);
    playStream('localStream', stream);
    call.on('stream',remoteStream => playStream('remoteStream', remoteStream));
  });
});

$('#ulUser').on('click', 'li',function (){
  const id = $(this).attr('id');
  openStream().then(stream => {
    playStream('localStream', stream);

    const call =  peer.call(id, stream);
    // khi mở ra stream sẽ có đc cái remoteStream và lắng nghe stream đó
    call.on('stream',remoteStream => playStream('remoteStream', remoteStream));
  });
});
