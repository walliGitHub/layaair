export default class CartoonMaterial extends Laya.Material {
		
	public static ALBEDOTEXTURE:number = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
	public static BLENDTEXTURE:number = Laya.Shader3D.propertyNameToID("u_BlendTexture");
	public static OUTLINETEXTURE:number = Laya.Shader3D.propertyNameToID("u_OutlineTexture");
	public static SHADOWCOLOR:number = Laya.Shader3D.propertyNameToID("u_ShadowColor");
	public static SHADOWRANGE:number = Laya.Shader3D.propertyNameToID("u_ShadowRange");
	public static SHADOWINTENSITY:number = Laya.Shader3D.propertyNameToID("u_ShadowIntensity");
	public static SPECULARRANGE:number = Laya.Shader3D.propertyNameToID("u_SpecularRange");
	public static SPECULARINTENSITY:number = Laya.Shader3D.propertyNameToID("u_SpecularIntensity");
	public static OUTLINEWIDTH:number = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
	public static OUTLINELIGHTNESS:number = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
	public static TILINGOFFSET:number;
	
	public static SHADERDEFINE_ALBEDOTEXTURE:number;
	public static SHADERDEFINE_BLENDTEXTURE:number;
	public static SHADERDEFINE_OUTLINETEXTURE:number;
	public static SHADERDEFINE_TILINGOFFSET:number;
	
	/**@private */
	public static shaderDefines:Laya.ShaderDefines = new Laya.ShaderDefines(Laya.BaseMaterial.shaderDefines);

	/**
	 * @private
	 */
	public static __init__():void {
		CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE = this.shaderDefines.registerDefine("ALBEDOTEXTURE");
		CartoonMaterial.SHADERDEFINE_BLENDTEXTURE = this.shaderDefines.registerDefine("BLENDTEXTURE");
		CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE = this.shaderDefines.registerDefine("OUTLINETEXTURE");
		CartoonMaterial.SHADERDEFINE_TILINGOFFSET = this.shaderDefines.registerDefine("TILINGOFFSET");
	}
	
	public static initShader():void {
		
		CartoonMaterial.__init__();
		
		var attributeMap:Object = 
		{
			'a_Position': Laya.VertexMesh.MESH_POSITION0, 
			'a_Normal': Laya.VertexMesh.MESH_NORMAL0, 
			'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
		};
		var uniformMap:Object = 
		{
			'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 
			'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE, 
			'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA, 
			'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_BlendTexture': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_OutlineTexture': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_ShadowColor': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_ShadowRange': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_ShadowIntensity': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_SpecularRange': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_SpecularIntensity': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL, 
			'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
			'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE, 
			'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE
		};
		var cartoonShader3D = Laya.Shader3D.add("CartoonShader");
		var subShader = new Laya.SubShader(attributeMap, uniformMap,Laya.SkinnedMeshSprite3D.shaderDefines,CartoonMaterial.shaderDefines) as Laya.SubShader;
		cartoonShader3D.addSubShader(subShader);
		//var vs1:String = __INCLUDESTR__("shader/outline.vs");
		var vs1:string = `
		attribute vec4 a_Position; 
		attribute vec3 a_Normal; 
		attribute vec2 a_Texcoord0;
		uniform mat4 u_MvpMatrix; 
		uniform float u_OutlineWidth; 
		varying vec2 v_Texcoord0;     
		void main() 
		{ 
		   v_Texcoord0 = a_Texcoord0; 
		   vec4 position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0); 
		   gl_Position = u_MvpMatrix * position; 
		}`;
		var ps1:string = `
		#ifdef FSHIGHPRECISION 
		   precision highp float; 
		#else 
		   precision mediump float; 
		#endif 
	
		struct DirectionLight 
		{ 
		   vec3 Color; 
		   vec3 Direction; 
		}; 
	
		varying vec2 v_Texcoord0; 
	
		#ifdef OUTLINETEXTURE 
		   uniform sampler2D u_OutlineTexture; 
		#endif 
		   uniform float u_OutlineLightness; 
	
		void main() 
		{ 
		vec4 outlineTextureColor = vec4(1.0); 
		#ifdef OUTLINETEXTURE 
		   outlineTextureColor = texture2D(u_OutlineTexture, v_Texcoord0); 
		#endif 
		vec3 finalColor = outlineTextureColor.rgb * u_OutlineLightness; 
		gl_FragColor = vec4(finalColor,0.0); 
		}`;
	
		var pass1:Laya.ShaderPass = subShader.addShaderPass(vs1, ps1) as Laya.ShaderPass;
		pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
		var vs2:string = `
		attribute vec4 a_Position; 
		attribute vec3 a_Normal;
		attribute vec2 a_Texcoord0;	
		uniform mat4 u_MvpMatrix;
		uniform mat4 u_WorldMat;
		uniform vec3 u_CameraPos;	
		varying vec2 v_Texcoord0;
		varying vec3 v_Normal;
		varying vec3 v_PositionWorld;
		varying vec3 v_ViewDir;
		
		void main()
		{
		    gl_Position = u_MvpMatrix * a_Position;		
		    mat3 worldMat = mat3(u_WorldMat);
			v_PositionWorld = (u_WorldMat * a_Position).xyz;
			v_Normal = worldMat * a_Normal;
			v_Texcoord0 = a_Texcoord0;		
			v_ViewDir = u_CameraPos - v_PositionWorld; 
		}`;

		var ps2:string = `
		#ifdef FSHIGHPRECISION
			precision highp float;
		#else
			precision mediump float;
		#endif
	
		struct DirectionLight
		{
			vec3 Color;
			vec3 Direction;
		};
	
		varying vec2 v_Texcoord0;
		varying vec3 v_Normal;
		varying vec3 v_PositionWorld;
		varying vec3 v_ViewDir;
	
		#ifdef ALBEDOTEXTURE
			uniform sampler2D u_AlbedoTexture;
		#endif
	
		#ifdef BLENDTEXTURE
			uniform sampler2D u_BlendTexture;
		#endif
	
		uniform vec4 u_ShadowColor;
		uniform float u_ShadowRange;
		uniform float u_ShadowIntensity;
		uniform float u_SpecularRange;
		uniform float u_SpecularIntensity;
	
		uniform DirectionLight u_DirectionLight;
	
		void main()
		{
			vec3 normal = normalize(v_Normal);
			vec3 viewdir = normalize(v_ViewDir);
			vec3 lightDir = normalize(u_DirectionLight.Direction);
		
			vec4 albedoTextureColor = vec4(1.0);
		#ifdef ALBEDOTEXTURE
			albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);
		#endif
		
		vec4 blendTextureColor = vec4(1.0); 
		#ifdef BLENDTEXTURE
			blendTextureColor = texture2D(u_BlendTexture, v_Texcoord0);
		#endif
		
		float blendTexColorG = blendTextureColor.g;
		
		//Overlay BlendMode ??????
		vec3 albedoColor;
		albedoColor.r = albedoTextureColor.r > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.r) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.r * blendTexColorG;
		albedoColor.g = albedoTextureColor.g > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.g) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.g * blendTexColorG;
		albedoColor.b = albedoTextureColor.b > 0.5 ? 1.0 - 2.0 * (1.0 - albedoTextureColor.b) * (1.0 - blendTexColorG) : 2.0 * albedoTextureColor.b * blendTexColorG;
		
		albedoColor = clamp(albedoColor, 0.0, 1.0);
		
		float nl = max(dot(normal, -lightDir), 0.0);
		
		float shadowValue = nl + blendTexColorG - 0.5;
		float shadow = step(shadowValue, u_ShadowRange);
		if(u_ShadowRange > (shadowValue + 0.015))
			shadow = 1.0;
		else if(u_ShadowRange < (shadowValue - 0.015))
			shadow = 0.0;
		else
			shadow = (u_ShadowRange - (shadowValue - 0.015)) / 0.03;
			
		shadow = clamp(shadow, 0.0, 1.0);
		
		//specularTextureColor.r ??????????????????
		float specular = step(u_SpecularRange, clamp(pow(nl, blendTextureColor.r), 0.0, 1.0));
		//specularTextureColor.b ??????????????????
		specular = step(0.1, specular * blendTextureColor.b);
		
		vec3 albedoAreaColor = (1.0 - shadow) * albedoColor;
		vec3 shadowAreaColor = shadow * albedoColor * u_ShadowColor.rgb * u_ShadowIntensity;
		vec3 speculAreaColor = (1.0 - shadow) * albedoColor * u_SpecularIntensity * specular;
		
		vec3 finalColor = albedoAreaColor + speculAreaColor + shadowAreaColor;
		
		gl_FragColor = vec4(finalColor, 1.0);
		}`;
	
		subShader.addShaderPass(vs2, ps2);
	}
	
	/**
	 * ????????????????????????
	 * @return ??????????????????
	 */
	public  get albedoTexture():Laya.BaseTexture {
		return this._shaderValues.getTexture(CartoonMaterial.ALBEDOTEXTURE);
	}
	
	/**
	 * ????????????????????????
	 * @param value ??????????????????
	 */
	public  set albedoTexture(value:Laya.BaseTexture) {
		if (value)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_ALBEDOTEXTURE);
		this._shaderValues.setTexture(CartoonMaterial.ALBEDOTEXTURE, value);
	}
	
	/**
	 * ?????????????????????
	 * @return ???????????????
	 */
	public get blendTexture():Laya.BaseTexture {
		return this._shaderValues.getTexture(CartoonMaterial.BLENDTEXTURE);
	}
	
	/**
	 * ?????????????????????
	 * @param value ???????????????
	 */
	public set blendTexture(value:Laya.BaseTexture) {
		if (value)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_BLENDTEXTURE);
		else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_BLENDTEXTURE);
		this._shaderValues.setTexture(CartoonMaterial.BLENDTEXTURE, value);
	}
	
	/**
	 * ????????????????????????
	 * @return ???????????????
	 */
	public get outlineTexture():Laya.BaseTexture {
		return this._shaderValues.getTexture(CartoonMaterial.OUTLINETEXTURE);
	}
	
	/**
	 * ?????????????????????
	 * @param value ???????????????
	 */
	public set outlineTexture(value:Laya.BaseTexture) {
		if (value)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE);
		else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_OUTLINETEXTURE);
		this._shaderValues.setTexture(CartoonMaterial.OUTLINETEXTURE, value);
	}
	
	/**
	 * ?????????????????????
	 * @return ???????????????
	 */
	public get shadowColor():Laya.Vector4 {
		return this._shaderValues.getVector(CartoonMaterial.SHADOWCOLOR) as Laya.Vector4;
	}
	
	/**
	 * ?????????????????????
	 * @param value ???????????????
	 */
	public set shadowColor(value:Laya.Vector4) {
		this._shaderValues.setVector(CartoonMaterial.SHADOWCOLOR, value);
	}
	
	/**
	 * ?????????????????????
	 * @return ????????????,?????????0???1???
	 */
	public get shadowRange():number {
		return this._shaderValues.getNumber(CartoonMaterial.SHADOWRANGE);
	}
	
	/**
	 * ?????????????????????
	 * @param value ????????????,?????????0???1???
	 */
	public set shadowRange(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWRANGE, value);
	}
	
	/**
	 * ?????????????????????
	 * @return ????????????,?????????0???1???
	 */
	public get shadowIntensity():number {
		return this._shaderValues.getNumber(CartoonMaterial.SHADOWINTENSITY);
	}
	
	/**
	 * ?????????????????????
	 * @param value ????????????,?????????0???1???
	 */
	public set shadowIntensity(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWINTENSITY, value);
	}
	
	/**
	 * ?????????????????????
	 * @return ????????????,?????????0.9???1???
	 */
	public get specularRange():number {
		return this._shaderValues.getNumber(CartoonMaterial.SPECULARRANGE);
	}
	
	/**
	 * ?????????????????????
	 * @param value ????????????,?????????0.9???1???
	 */
	public set specularRange(value:number) {
		value = Math.max(0.9, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SPECULARRANGE, value);
	}
	
	
	
	/**
	 * ?????????????????????
	 * @return ????????????,?????????0???0.05???
	 */
	public get outlineWidth():number {
		return this._shaderValues.getNumber(CartoonMaterial.OUTLINEWIDTH);
	}
	
	/**
	 * ?????????????????????
	 * @param value ????????????,?????????0???0.05???
	 */
	public set outlineWidth(value:number) {
		value = Math.max(0.0, Math.min(0.05, value));
		this._shaderValues.setNumber(CartoonMaterial.OUTLINEWIDTH, value);
	}
	
	/**
	 * ?????????????????????
	 * @return ????????????,?????????0???1???
	 */
	public get outlineLightness():number {
		return this._shaderValues.getNumber(CartoonMaterial.OUTLINELIGHTNESS);
	}
	
	/**
	 * ?????????????????????
	 * @param value ????????????,?????????0???1???
	 */
	public set outlineLightness(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.OUTLINELIGHTNESS, value);
	}
	
	/**
	 * ?????????????????????
	 * @param value ????????????,?????????0???1???
	 */
	public set specularIntensity(value:number) {
		value = Math.max(0.0, Math.min(1.0, value));
		this._shaderValues.setNumber(CartoonMaterial.SPECULARINTENSITY, value);
	}
	/**
	 * ?????????????????????
	 * @return ????????????,?????????0???1???
	 */
	public get specularIntensity():number {
		return this._shaderValues.getNumber(CartoonMaterial.SPECULARINTENSITY);
	}
	
	/**
	 * ??????????????????????????????
	 * @return ????????????????????????
	 */
	public get tilingOffset():Laya.Vector4 {
		return this._shaderValues.getVector(CartoonMaterial.TILINGOFFSET) as Laya.Vector4;
	}
	
	/**
	 * ??????????????????????????????
	 * @param value ????????????????????????
	 */
	public set tilingOffset(value:Laya.Vector4) {
		if (value) {
			if (value.x != 1 || value.y != 1 || value.z != 0 || value.w != 0)
			this._defineDatas.add(CartoonMaterial.SHADERDEFINE_TILINGOFFSET);
			else
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_TILINGOFFSET);
		} else {
			this._defineDatas.remove(CartoonMaterial.SHADERDEFINE_TILINGOFFSET);
		}
		this._shaderValues.setVector(CartoonMaterial.TILINGOFFSET, value);
	}
	
	constructor() {
		super();
		this.setShaderName("CartoonShader");
		this._shaderValues.setVector(CartoonMaterial.SHADOWCOLOR, new Laya.Vector4(0.6663285, 0.6544118, 1, 1));
		this._shaderValues.setNumber(CartoonMaterial.SHADOWRANGE, 0);
		this._shaderValues.setNumber(CartoonMaterial.SHADOWINTENSITY, 0.7956449);
		this._shaderValues.setNumber(CartoonMaterial.SPECULARRANGE, 0.9820514);
		this._shaderValues.setNumber(CartoonMaterial.SPECULARINTENSITY, 1);
		this._shaderValues.setNumber(CartoonMaterial.OUTLINEWIDTH, 0.01581197);
		this._shaderValues.setNumber(CartoonMaterial.OUTLINELIGHTNESS, 1);
	}
}