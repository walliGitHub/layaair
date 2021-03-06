function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

var id = GetQueryString("id") || 0;

var list = [
	"Animation_Altas",
	"Animation_SWF",
	"BlendMode_Lighter",
	"Filters_Blur",
	"Filters_Color",
	"Filters_Glow",
	"HitTest_Point",
	"HitTest_Rectangular",
	"InputDevice_Compass",
	"InputDevice_GluttonousSnake",
	"Interaction_CustomEvent",
	"Interaction_Drag",
	"Interaction_FixInteractiveRegion",
	"Interaction_Hold",
	"Interaction_Mouse",
	"Interaction_Rotate",
	"Interaction_Scale",
	"Interaction_Swipe",
	"Particle_T1",
	"Particle_T2",
	"Particle_T3",
	"PerformanceTest_Cartoon2",
	"PerformanceTest_Cartoon",
	"PerformanceTest_Maggots",
	"PerformanceTest_Skeleton",
	"PIXI_Example_04",
	"PIXI_Example_05",
	"PIXI_Example_21",
	"PIXI_Example_23",
	"Skeleton_ChangeSkin",
	"Skeleton_MultiTexture",
	"Skeleton_SpineEvent",
	"Skeleton_SpineIkMesh",
	"Skeleton_SpineStretchyman",
	"Skeleton_SpineVine",
	"SmartScale_T",
	"Sound_SimpleDemo",
	"Sprite_ScreenShot",
	"Sprite_Cache",
	"Sprite_Container",
	"Sprite_DisplayImage",
	"Sprite_DrawPath",
	"Sprite_DrawShapes",
	"Sprite_Guide",
	"Sprite_MagnifyingGlass",
	"Sprite_NodeControl",
	"Sprite_Pivot",
	"Sprite_RoateAndScale",
	"Sprite_SwitchTexture",
	"Text_AutoSize",
	"Text_BitmapFont",
	"Text_ComplexStyle",
	"Text_Editable",
	"Text_HTML",
	"Text_InputMultiline",
	"Text_InputSingleline",
	"Text_MaxChars",
	"Text_Overflow",
	"Text_Prompt",
	"Text_Restrict",
	"Text_Scroll",
	"Text_Underline",
	"Text_WordWrap",
	"TiledMap_AnimationTile",
	"TiledMap_IsometricWorld",
	"TiledMap_PerspectiveWall",
	"TiledMap_ScrollMap",
	"Timer_DelayExcute",
	"Timer_Interval",
	"Tween_EaseFunctionsDemo",
	"Tween_Letters",
	"Tween_SimpleSample",
	"Tween_TimeLine",
	"UI_Button",
	"UI_CheckBox",
	"UI_Clip",
	"UI_ColorPicker",
	"UI_ComboBox",
	"UI_Dialog",
	"UI_Image",
	"UI_Input",
	"UI_Label",
	"UI_List",
	"UI_ProgressBar",
	"UI_RadioGroup",
	"UI_ScrollBar",
	"UI_Slider",
	"UI_Tab",
	"UI_TextArea",
	"UI_Tree",
	"UI_Panel",
	"Debug_FPSStats",
	"InputDevice_Video",
	"InputDevice_Map",
	"InputDevice_Media",
	"InputDevice_Shake",
	"Interaction_Keyboard",
	"Loader_MultipleType",
	"Loader_ProgressAndErrorHandle",
	"Loader_Sequence",
	"Loader_SingleType",
	"Network_GET",
	"Network_POST",
	"Network_ProtocolBuffer",
	"Network_Socket",
	"Network_XML",
	"SmartScale_Align_Contral",
	"SmartScale_Landscape",
	"SmartScale_Portrait",
	"SmartScale_Scale_EXTRACT_FIT",
	"SmartScale_Scale_NOBORDER",
	"SmartScale_Scale_NOSCALE",
	"SmartScale_Scale_SHOW_ALL",
	"Timer_CallLater",
 ];

 var url="2d/js/"+list[id]+".js";
 var xhr = new XMLHttpRequest();
 xhr.open('GET',url,true);
 xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
 xhr.onerror=function(e){
	 alert('onerr');
 }
//if(window.conch)
//PerfShow(true);

 xhr.onload=function(e){
    
     window._mouselist=[];
	 
	 function addMouse(t){
	   if(window._mouselist.length<3)
	     window._mouselist.push(t);
	   else
	   {
	      window._mouselist.shift();
		  window._mouselist.push(t);
	   }
	   if(window._mouselist.length==3)
		{
		    return (window._mouselist[0]+window._mouselist[1]+window._mouselist[2])<=window._mouselist[0]*3+500;
		}
		else
		{
		  return false;
		}
	 }
	 // window.conch&&conch.showLoadingView(false);
     window.eval(xhr.responseText);
	 var mousetype=('ontouchstart' in window)?"touchstart":"mousedown";

	

	 function loadNewPage()
	 {
		id++
		var pre=location.protocol+"//"+location.host+location.pathname;
		var url=pre+"?id="+id;
		console.log(">>>>>>>@@@@@@@@@@@@@@@="+url);
	    window.location.href=url;
	 }
	 document.addEventListener(mousetype,function(e){
	   if(addMouse(Date.now()))
	   {
			loadNewPage();
	   }
	 
	 });
	 
	 
	 window.document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {

        case 82:
            loadNewPage();
            break;
    }
});
	 
	 
	 
 }
 xhr.send();//
 