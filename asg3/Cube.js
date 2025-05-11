class Cube {
    constructor() {
        this.type='cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.cubeVerts32 = new Float32Array([
          0,0,0 ,  1,1,0,  1,0,0
          ,
          0,0,0,  0,1,0,  1,1,0
          ,
          0,1,0,  0,1,1,  1,1,1
          ,
          0,1,0,  1,1,1,  1,1,0
          ,
          1,1,0,  1,1,1,  1,0,0
          ,
          1,0,0,  1,1,1,  1,0,1
          ,
          0,1,0,  0,1,1,  0,0,0
          ,
          0,0,0,  0,1,1,  0,0,1
          ,
          0,0,0,  0,0,1,  1,0,1
          ,
          0,0,0,  1,0,1,  1,0,0
          ,
          0,0,1,  1,1,1,  1,0,1
          ,
          0,0,1,  0,1,1,  1,1,1
        ]);
        this.cubeVerts=[
          0,0,0 ,  1,1,0,  1,0,0
          ,
          0,0,0,  0,1,0,  1,1,0
          ,
          0,1,0,  0,1,1,  1,1,1
          ,
          0,1,0,  1,1,1,  1,1,0
          ,
          1,1,0,  1,1,1,  1,0,0
          ,
          1,0,0,  1,1,1,  1,0,1
          ,
          0,1,0,  0,1,1,  0,0,0
          ,
          0,0,0,  0,1,1,  0,0,1
          ,
          0,0,0,  0,0,1,  1,0,1
          ,
          0,0,0,  1,0,1,  1,0,0
          ,
          0,0,1,  1,1,1,  1,0,1
          ,
          0,0,1,  0,1,1,  1,1,1
        ]
        this.UVcubeVerts=[
          0,0, 1,1, 1,0  //front
          ,
          0,0, 0,1, 1,1
          ,
          0,0, 0,1, 1,1  //top
          ,
          0,0, 1,1, 1,0
          ,
          0,1, 1,1, 0,0  //left
          ,
          0,0, 1,1, 1,0
          ,
          1,1, 0,1, 1,0  //right
          ,
          1,0, 0,1, 0,0
          ,
          1,0, 1,1, 0,1  //bot
          ,
          1,0, 0,1, 0,0
          ,
          1,0, 0,1, 0,0  //back
          ,
          1,0, 1,1, 0,1
        ];   
    }

    render() {
        
        var rgba = this.color;

        // Pass the texture number to u_Texture variable
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to a u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);



        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      //front
      drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0])
    //   drawTriangle3D([ 0,0,0, 1,1,0,  1,0,0 ]);
      drawTriangle3DUV( [0,0,0, 0,1,0,  1,1,0], [0,0, 0,1, 1,1])
    //   drawTriangle3D([ 0,0,0,  0,1,0,  1,1,0 ]);

      //top
      gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3])
      drawTriangle3DUV([ 0,1,0,  1,1,1,  0,1,1, ], [0,0, 1,1, 0,1,]);
      drawTriangle3DUV([ 0,1,0,  1,1,0,  1,1,1, ], [0,0, 1,0, 1,1]);
    //   drawTriangle3D([ 0,1,0,  0,1,1,  1,1,1 ]);
    //   drawTriangle3D([ 0,1,0,  1,1,1,  1,1,0 ]);

      //left
      gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3])
      drawTriangle3DUV([ 1,0,0,  1,1,1,  1,0,1 ], [0,0, 1,1, 1,0,]);
      drawTriangle3DUV([ 1,0,0,  1,1,1,  1,1,0 ], [0,0, 1,1, 0,1,]);
    //   drawTriangle3D([ 1,0,0,  1,1,1,  1,0,1 ]);
    //   drawTriangle3D([ 1,0,0,  1,1,1,  1,1,0 ]);

      //right
      gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3])
      drawTriangle3DUV([ 0,0,0,  0,0,1,  0,1,1 ], [1,0, 0,0, 0,1,]);
      drawTriangle3DUV([ 0,0,0,  0,1,0,  0,1,1 ], [1,0, 1,1, 0,1,]);
    //   drawTriangle3D([ 0,0,0,  0,0,1,  0,1,1 ]);
    //   drawTriangle3D([ 0,0,0,  0,1,0,  0,1,1 ]);

      //bot
      gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3])
      drawTriangle3DUV([ 0,0,0,  0,0,1,  1,0,1 ], [0,1, 0,0, 1,0,]);
      drawTriangle3DUV([ 0,0,0,  1,0,0,  1,0,1 ], [0,1, 1,1, 1,0,]);
    //   drawTriangle3D([ 0,0,0,  0,0,1,  1,0,1 ]);
    //   drawTriangle3D([ 0,0,0,  1,0,0,  1,0,1 ]);

      //back
      gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3])
      drawTriangle3DUV([ 1,1,1,  0,0,1,  0,1,1 ], [0,1, 1,0, 1,1,]);
      drawTriangle3DUV([ 1,1,1,  0,0,1,  1,0,1 ], [0,1, 1,0, 0,0,]);
    //   drawTriangle3D([ 1,1,1,  0,0,1,  0,1,1 ]);
    //   drawTriangle3D([ 1,1,1,  0,0,1,  1,0,1 ]);

        

    }
    renderFast() {
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;
      gl.uniform1i(u_whichTexture, -2);
    
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
      var allverts=[];
      //front
      allverts=allverts.concat( [0,0,0, 1,1,0, 1,0,0 ]);
      allverts=allverts.concat( [0,0,0, 0,1,0, 1,1,0 ]);
    
      //top
      //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3])
      allverts=allverts.concat( [0,1,0,  0,1,1,  1,1,1 ]);
      allverts=allverts.concat( [0,1,0,  1,1,1,  1,1,0 ]);
    
      //left
      //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3])
      allverts=allverts.concat( [0,1,0,  0,1,1,  0,0,0 ]);
      allverts=allverts.concat( [0,0,0,  0,1,1,  0,0,1 ]);
    
      //right
      //gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3])
      allverts=allverts.concat( [1,1,0,  1,1,1,  1,0,0 ]);
      allverts=allverts.concat( [1,0,0,  1,1,1,  1,0,1 ]);
    
      //bot
      //gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3])
      allverts=allverts.concat( [0,0,0,  0,0,1,  1,0,1 ]);
      allverts=allverts.concat( [0,0,0,  1,0,1,  1,0,0 ]);
    
      //back
      //gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3])
      allverts=allverts.concat( [0,0,1,  1,1,1,  1,0,1 ]);
      allverts=allverts.concat( [0,0,1,  0,1,1,  1,1,1 ]);
      drawTriangle3D(allverts);
    }
    renderFaster() {
      var rgba = this.color;
      gl.uniform1i(u_whichTexture, this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      // if (g_vertexBuffer == null) {
        // initTriangle3D();
      // }
      // gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts, gl.DYNAMIC_DRAW);
      // gl.drawArrays(gl.TRIANGLES,0, 36);
      drawTriangle3DUV(this.cubeVerts32, this.UVcubeVerts);
    }
}
