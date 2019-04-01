function compile()
{
    // Converts the opcodes into text that the emulator can read
    var CH8 = "";
    var text = document.getElementById("EDITOR").value;
    if (text != "")
    {
        var opcodes = text.split("\n");
        for (let i = 0; i < opcodes.length; i++)
        {
            if (!isNaN("0x" + opcodes[i].slice(0,4)))
            {   CH8 += String.fromCharCode("0x" + opcodes[i].slice(0,2));   // This is at most 8 bits or 1 byte long
                CH8 += String.fromCharCode("0x" + opcodes[i].slice(2, 4));     // This is at most 8 bits or 1 byte long
            }
        }
        document.getElementById("VIEWER").innerHTML = CH8;
        run(CH8); // Automatically runs the opcodes
    }
}

function run(CH8)
{
    Processor.init();
    Processor.loadComp(CH8);
    /*var buffer = new ArrayBuffer(CH8.length);
    //var bufferView = new Uint8Array(buffer);
    for (let i = 0; i < CH8.length; i += 2)
    {
        // Each element holds a byte, which is half an opcode.
        buffer[i] = CH8.charCodeAt(i);
        buffer[i + 1] = CH8.charCodeAt(i + 1);
    }
    var memIndex = 512;
    for (let i = 0; i < buffer.byteLength; i += 2)
    {
        let opc1 = buffer[i].toString(16);      // This is 8 bits or 1 byte long
        let opc2 = buffer[i + 1].toString(16);  // This is 8 bits or 1 byte long
        if (opc1.length == 1)
        {
            opc1 = "0" + opc1;
        }
        if (opc2.length == 1)
        {
            opc2 = "0" + opc2;
        }
        Processor.Memory[memIndex] = "0x" + opc1;
        Processor.Memory[memIndex + 1] = "0x" + opc2;
        memIndex += 2;
    }*/
    Processor.main();
}