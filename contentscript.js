console.log("Recipe Calculator 0.1 loading..");

//----<<< Required variables & functions >>>----\\

const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(a){var c,d,e,f,g,h,i,b="",j=0;for(a=Base64._utf8_encode(a);j<a.length;)c=a.charCodeAt(j++),d=a.charCodeAt(j++),e=a.charCodeAt(j++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),b=b+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return b},decode:function(a){var c,d,e,f,g,h,i,b="",j=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");j<a.length;)f=this._keyStr.indexOf(a.charAt(j++)),g=this._keyStr.indexOf(a.charAt(j++)),h=this._keyStr.indexOf(a.charAt(j++)),i=this._keyStr.indexOf(a.charAt(j++)),c=f<<2|g>>4,d=(15&g)<<4|h>>2,e=(3&h)<<6|i,b+=String.fromCharCode(c),64!=h&&(b+=String.fromCharCode(d)),64!=i&&(b+=String.fromCharCode(e));return b=Base64._utf8_decode(b)},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b+=String.fromCharCode(d):d>127&&d<2048?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b},_utf8_decode:function(a){for(var b="",c=0,d=0,f=0;c<a.length;)d=a.charCodeAt(c),d<128?(b+=String.fromCharCode(d),c++):d>191&&d<224?(f=a.charCodeAt(c+1),b+=String.fromCharCode((31&d)<<6|63&f),c+=2):(f=a.charCodeAt(c+1),c3=a.charCodeAt(c+2),b+=String.fromCharCode((15&d)<<12|(63&f)<<6|63&c3),c+=3);return b}};

function encodeURL(str){
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

function decodeUrl(str){
    str = (str + '===').slice(0, str.length + (str.length % 4));
    return str.replace(/-/g, '+').replace(/_/g, '/');
}

//----<<< Main filtering >>>----\\

if (window.location.host == "www.chefkoch.de") {

  var table = document.getElementsByClassName("incredients")[0];
  var title = document.getElementsByClassName("page-title")[0];
  var data  = [];

  if (title !== undefined && table !== undefined) {
    table = table.childNodes[1].childNodes;
    title = title.innerText;

    for (var x of table) {
      console.log("<<---------->>");

      if (x.nodeName == "TR") {
        var amount  = x.childNodes[1].innerText;
        var text    = x.childNodes[3].innerText;
        var value   = amount.match(/[\d,]+(?:\s[\d/]+)?/);
        var unit    = amount.replace(/[\d,]+(?:\s[\d/]+)?/, "").substring(1);

        if (Array.isArray(value)) {
          value = value[0].split(" ");
          if (value.length == 1) {
            value = Number(value[0].replace(",", "."));
          } else {
            var valueRaw  = Number(value[0]);
            var value     = value[1].split("/");
            value         = Number(value[0]) / Number(value[1]);
            value        += valueRaw;
          }
        } else {
          value = 1;
        }
        console.log(value);
        if (unit === "") unit = "Stück";
        console.log(value+" "+unit+" | "+text);
        data.push(
          {
            'value'       : value,
            'startValue'  : value,
            'unit'        : unit,
            'name'        : text
          });
      }
    }

    var dataArray = {
      'name' : title,
      'data' : data
    };

    var code  = encodeURL(Base64.encode(JSON.stringify(dataArray)));
    var url   = "http://localhost/#"+code;

    var form          = document.getElementById("incredientform");
    var button        = document.createElement("a");
    button.href       = url;
    button.target     = "_blank";
    button.className  = "RCbutton";
    button.innerHTML  = "RecipeCalc.io";

    form.appendChild(button);
  } else {
    console.log("No recipe found");
  }
} else {
  console.log("Website not supported!");
}
