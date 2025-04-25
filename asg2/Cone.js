// Used ChatGPT
class Cone {
    constructor() {
        this.type = 'cone';
        this.color = [1.0, 1.0, 1.0, 1.0]; // Default color
        this.matrix = new Matrix4(); // Transformation matrix
        this.slices = 36; // Number of slices for the circular base
    }

    render() {
        var rgba = this.color;

        // Pass the color of the cone to the u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the transformation matrix to the shader
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Draw the base of the cone
        this.drawBase();

        // Draw the sides of the cone
        this.drawSides();
    }

    drawBase() {
        const center = [0, 0, 0]; // Center of the base
        const radius = 1.0; // Radius of the base
        const angleStep = (2 * Math.PI) / this.slices;

        for (let i = 0; i < this.slices; i++) {
            const angle1 = i * angleStep;
            const angle2 = (i + 1) * angleStep;

            const x1 = radius * Math.cos(angle1);
            const z1 = radius * Math.sin(angle1);
            const x2 = radius * Math.cos(angle2);
            const z2 = radius * Math.sin(angle2);

            drawTriangle3D([
                center[0], center[1], center[2], // Center of the base
                x1, center[1], z1,               // First vertex on the circle
                x2, center[1], z2                // Second vertex on the circle
            ]);
        }
    }

    drawSides() {
        const apex = [0, 1, 0]; // Apex of the cone
        const radius = 1.0; // Radius of the base
        const angleStep = (2 * Math.PI) / this.slices;

        for (let i = 0; i < this.slices; i++) {
            const angle1 = i * angleStep;
            const angle2 = (i + 1) * angleStep;

            const x1 = radius * Math.cos(angle1);
            const z1 = radius * Math.sin(angle1);
            const x2 = radius * Math.cos(angle2);
            const z2 = radius * Math.sin(angle2);

            drawTriangle3D([
                apex[0], apex[1], apex[2],       // Apex of the cone
                x1, 0, z1,                       // First vertex on the circle
                x2, 0, z2                        // Second vertex on the circle
            ]);
        }
    }
}