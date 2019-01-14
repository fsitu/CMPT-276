var Processor = new function()
{
    this.Memory = new Uint8Array(4096); // Stores instructions
    this.Memory[0] = ("0x0000" & "0xFF00") >>> 8;
    this.Memory[1] = ("0x0000" & "0x00FF");
    this.Memory[2] = ("0x00E0" & "0xFF00") >>> 8;
    this.Memory[3] = ("0x00E0" & "0x00FF");
    this.Memory[4] = ("0x1000" & "0xFF00") >>> 8;
    this.Memory[5] = ("0x1000" & "0x00FF");
    this.Memory[6] = ("0x2000" & "0xFF00") >>> 8;
    this.Memory[7] = ("0x2000" & "0x00FF");
    this.Memory[8] = ("0x3000" & "0xFF00") >>> 8; // SkipNextInstruction_VxEQkk
    this.Memory[9] = ("0x3000" & "0x00FF");

    this.Registers = new Uint8Array(16);
    this.Stack = new Uint16Array(16);

    this.PC = 0;

    this.init = function()
    {
        console.log("Hello World!");
        for (var i = 0; i <= 9; i++)
        {
            console.log(this.Memory[i]);
        }
        this.Registers[0] = 10;
    };

    this.fetch = function() // Fetches from the program stored in the memory
    {

    };

    this.execute = function(opcode) // Finds ("reads") and executes
    {
        for (var i = 0; i < 512; i++) // Traverses over memory locations 0 to 511 (0x01FF)
        {
            if ((opcode & "0xF000") >>> 8 == this.Memory[i]) // Finds a match
            {
                if (i == 8) // SkipNextInstruction_VxEQkk
                //if (this.Memory[i] == 48) // SkipNextInstruction_VxEQkk
                {
                    if (this.Registers[(opcode & "0x0F00") >>> 8] == (opcode & "0x00FF"))
                    {
                        this.PC += 2;
                    }
                    break;
                }
            }
        }
    }
}