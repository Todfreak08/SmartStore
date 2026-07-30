auth.onAuthStateChanged((user)=>{

if(!user){

window.location.href="index.html";

return;

}

document.getElementById("email").innerHTML=user.email;

});

function logout(){

auth.signOut().then(()=>{

window.location.href="index.html";

});

}