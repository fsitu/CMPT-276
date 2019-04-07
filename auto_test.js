var errors = [];
var arr_opcode = [
    "DXYN",
    "FX29",
    "00E0",
    "0NNN",
    "00EE",
    "1NNN",
    "2NNN",
    "4XKK",
    "5XY0",
    "6XKK",
    "7XKK",
    "8XY0",
    "8XY1",
    "8XY2",
    "8XY3",
    "8XY4",
    "8XY5",
    "8XY6",
    "8XY7",
    "8XYE",
    "3XKK",
    "9XY0",
    "ANNN",
    "BNNN",
    "CXNN",
    "EX9E",
    "EXA1",
    "FX07",
    "FX0A",
    "FX15",
    "FX18",
    "FX1E",
    "FX33",
    "FX55",
    "FX65"
];
for(i=0; i<arr_opcode.length; i++)
{
    errors[i]=0;
}
var add_errors = function()
{
    var tot_errors = 0;
    for(i=0;i<errors.length;i++)
    {
        tot_errors += errors[i];
    }
    return tot_errors;
}
var display_test_result = function()
{
    console.log("<b>Total Number of Opcodes Tested: " + arr_opcode.length + "</b>");
    for(i=0; i<arr_opcode.length; i++)
    {
        console.log(errors[i]+" errors found in opcode: "+arr_opcode[i]);
    }
    console.log("Total Number of Errors:" + add_errors());
}
var main_test = function()
{
    console.log("------------------------------------------------------------------------------------------------------------------------");
    DXYN();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    sprite_loc();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    clear_display();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    //exec_subrout(); // Not implemented yet
    stack_return();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    jp_addr();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    call_addr();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    skip_inst_1();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    skip_inst_2();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    skip_inst_3();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    skip_inst_4();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    LD_1();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    ADD();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    LD_2();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    OR_1();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    AND_XY();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    XOR_XY();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    ADD_XY();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    SUB_XY();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    SHR_XY();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    SUBN();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    SHL();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    ANNN();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    BNNN();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    CXNN();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    skip_inst_5();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    skip_inst_6();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    VxtoDT();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    WaitSetVxtoKeyDown();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    SetDelayTimer_VxTODT();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    SetSoundTimer_VxTOST();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    AddVxIStore();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    StoreBCDRepVx();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    StoreV0VxtoMemory();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    ReadMemoryWriteV0Vx();
    console.log("------------------------------------------------------------------------------------------------------------------------");
    display_test_result();
    console.log("------------------------------------------------------------------------------------------------------------------------");
}

var hex_convert = function(N)
{
    return N.toString(16);
}
var ran_reg = function()
{
    for(i=0; i<16; i++)
    {
        Processor.Registers[i] = Math.floor((Math.random() * 255) + 1);
    }
}

var DXYN = function()
{
    console.log("<b>Testing Opcode: DXYN</b>");
    for(i=0; i<16; i++)
    {
        for(j=0; j<16; j++)
        {
            var hex_i = hex_convert(i);
            var hex_j = hex_convert(j);
            var opcode = "0xD" + hex_i + hex_j + "5";
            Processor.display_test(opcode);
            console.log("Display test completed!");
        }
    }
}

var sprite_loc = function()
{
    console.log("<b>Testing Opcode: FX29</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var opcode = "0xF" + hex_convert(i) + "2" + "9";
        Processor.execute(opcode);
        if(Processor.ISpecial != 70 + (Processor.Registers[i]*5))
        {
            errors[1]++;
            console.log("Test Failed");
        }
    }
    console.log("Test Completed")
}

var clear_display = function()
{
    console.log("<b>Testing Opcode: 00E0</b>");
    Processor.execute("0x00E0");
    for(i=0; i<Processor.display.length; i++)
    {
        if(Processor.display[i] != 0)
        {
            console.log("Test Failed");
            errors[2]++;
        }
    }
    console.log("Test Complete");
}
/*var exec_subrout = function()
{
    console.log("Testing Opcode: 0NNN");
    console.log(Processor.PC);
    for(i=0; i<16; i++)
    {
        var curr_sp = Processor.Stack_pointer; 
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var k_3 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x0" + hex_convert(k_1) + hex_convert(k_2) + hex_convert(k_3) ;
        Processor.execute(opcode);
        console.log(opcode);
        if(curr_sp+1 != Processor.Stack_pointer)
        {
            console.log("Test Failed: Invalid Stack Pointer");     
            errors[3]++;
        }
        if(Processor.PC != Number(opcode & 0x0FFF))
        {
            console.log("Test Failed: Incorrect PC");
            errors[3]++;
        }
    }
    console.log("Test Completed");
}*/
var stack_return = function()
{
    console.log("<b>Testing Opcode: 00EE</b>");
    Processor.execute("0x00EE");
}
var jp_addr = function()
{
    console.log("<b>Testing Opcode: 1NNN</b>");
    for(i=0; i<16; i++)
    {
        var opcode = "0x1" + hex_convert(i) + "00";
        Processor.execute(opcode);
        if(Processor.PC != ((opcode & 0x0FFF)-2))
        {
            console.log("Test Failed: PC");
            errors[5]++;
        }
    }
    console.log("Test Completed");
}
var call_addr = function()
{
    console.log("<b>Testing Opcode: 2NNN</b>");
    for(i=1; i<15; i++)
    {
        var prev_pc = Processor.PC
        var opcode = "0x2" + hex_convert(i) + "00";
        Processor.execute(opcode);
        if(Processor.Stack[Processor.Stack_pointer-1] != prev_pc)
        {
            console.log("Test Failed: Prev_PC is not on stack");
            errors[6]++;
        }
        if(Processor.PC != (opcode & 0x0FFF)-2)
        {
            console.log("Test Failed: Curr_PC is incorrect");
            errors[6]++;
        }
    }
    console.log("Test Completed");
}
var skip_inst_2 = function()
{
    console.log("<b>Testing Opcode: 4XKK</b>");
    var k_1 = Math.floor((Math.random() * 14) + 1);
    var k_2 = Math.floor((Math.random() * 14) + 1);
    ran_reg();
    for(i=0; i<16; i++)
    {
        var prev_pc = Processor.PC;
        var opcode = "0x" + "4" + hex_convert(i) + hex_convert(k_1) + hex_convert(k_2);
        Processor.execute(opcode);
        if(Processor.Registers[i] == Number(opcode & 0x00FF))
        {
            if(Processor.PC != prev_pc)
            {
                console.log("Test Failed: Vx == KK, but PC increased");
                errors[7]++;
            }
        }
        else 
        {
            if(Processor.PC != prev_pc+2)
            {
                console.log("Test Failed: PC did not increase");
                errors[7]++;
            }
        }
    }
    console.log("Test Completed");
}
var skip_inst_3 = function()
{
    console.log("<b>Testing Opcode: 5XY0</b>");
    var random_set = [];
    var random_set_2 = [];
    for(i=0; i<16; i++)
    {
        Processor.Registers[i] = Math.floor((Math.random() * 255) + 1);
        random_set[i] = Math.floor((Math.random() * 14) + 1);
        random_set_2[i] = Math.floor((Math.random() * 14) + 1);
    }
    for(i=0; i<16; i++)
    {
        var prev_pc = Processor.PC;
        var opcode = "0x" + "5" + hex_convert(random_set[i]) + hex_convert(random_set_2[i]) + "0";
        Processor.execute(opcode);
        if(Processor.Registers[random_set[i]] != Processor.Registers[random_set_2[i]])
        {
            if(Processor.PC != prev_pc)
            {
                console.log("Test Failed: Vx == KK, but PC increased");
                errors[8]++;
            }
        }
        else 
        {
            if(Processor.PC != prev_pc+2)
            {
                console.log("Test Failed: PC did not increase");
                errors[8]++;
            }
        }
    }
    console.log("Test Completed");
}
var LD_1 = function()
{
    console.log("<b>Testing Opcode: 6XKK</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "6" + hex_convert(i) + hex_convert(k_1) + hex_convert(k_2);
        Processor.execute(opcode);
        console.log(opcode);
        if(Processor.Registers[i] != Number(opcode & 0x00FF))
        {
            console.log("Test Failed");
            errors[9]++;
        }
    }
    console.log("Test Completed");
}
var ADD = function()
{
    console.log("<b>Testing Opcode: 7XKK</b>")
    ran_reg();
    for(i=0; i<16; i++)
    {
        var prev_reg = Processor.Registers[i];
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "7" + hex_convert(i) + hex_convert(k_1) + hex_convert(k_2);
        Processor.execute(opcode);

        if((prev_reg + (opcode&0x00FF))>255)
        {
            if(Processor.Registers[i] != (prev_reg + (opcode&0x00FF))-256)
            {

                console.log("Test Failed");
                errors[10]++;
            }
        }
        else
        {
            if(Processor.Registers[i] != prev_reg + (opcode&0x00FF))
            {
                console.log("Test Failed");
                errors[10]++;
            }
        }
    }
    console.log("Test Complete");
    
}
var LD_2 = function()
{
    console.log("<b>Testing Opcode: 8XY0</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var reg_y = Processor.Registers[k_2];
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "0";
        Processor.execute(opcode);
        if(Processor.Registers[k_1] != reg_y)
        {
            console.log("Test Failed");
            errors[11]++;
        }        
    }
    console.log("Test Completed");
}
var OR_1 = function()
{
    console.log("<b>Testing Opcode: 8XY1</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "1";
        var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
        var reg_y = Processor.Registers[(opcode & 0x00F0)>>>4];
        Processor.execute(opcode);
        if(Number(Processor.Registers[k_1]) != Number(reg_x | reg_y))
        {
            console.log("Test Failed");
            errors[12]++;
        }
    }
    console.log("Test Completed");
}
var AND_XY = function()
{
    console.log("<b>Testing Opcode: 8XY2</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "2";
        var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
        var reg_y = Processor.Registers[(opcode & 0x00F0)>>>4];
        Processor.execute(opcode);
        if(Number(Processor.Registers[k_1]) != Number(reg_x & reg_y))
        {
            console.log("Test Failed");
            errors[13]++;
        }
    }
    console.log("Test Completed");

}
var XOR_XY = function()
{   
    console.log("<b>Testing Opcode: 8XY3</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "3";
        var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
        var reg_y = Processor.Registers[(opcode & 0x00F0)>>>4];
        Processor.execute(opcode);
        if(Number(Processor.Registers[k_1]) != Number(reg_x ^ reg_y))
        {
            console.log("Test Failed");
            errors[14]++;
        }
    }
    console.log("Test Completed");
}
var ADD_XY = function()
{
    console.log("<b>Testing Opcode: 8XY4</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "4";
        var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
        var reg_y = Processor.Registers[(opcode & 0x00F0)>>>4];
        Processor.execute(opcode);
        if(Number(reg_x + reg_y)> 255)
        {
            if(Processor.Registers[0xF] != 1)
            {
                console.log("Test Failed: Overflow Error");
                errors[15]++;
            } 
        }
        else
        {
            if(Number(Processor.Registers[k_1]) != Number(reg_x+reg_y))
            {
                console.log("Test Failed: Arithmetic");
                errors[15]++;
            }
        }
    }
    console.log("Test Completed");
}
var SUB_XY = function()
{
    console.log("<b>Testing Opcode: 8XY5</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "5";
        var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
        var reg_y = Processor.Registers[(opcode & 0x00F0)>>>4];
        Processor.execute(opcode);
        if(Number(reg_x)>Number(reg_y))
        {
            if(Processor.Registers[0xF] != 1)
            {
                console.log("Test Failed: Overflow Error");
                errors[16]++;
            } 
        }
        else if(Number(reg_x)<Number(reg_y))
        {
            if(Number(Processor.Registers[k_1]) != Number(reg_x-reg_y)+256)
            {
                console.log("Test Failed: Arithmetic(x<y)");
                errors[16]++;
            }
        }
        else
        {
            if(Number(Processor.Registers[k_1]) != Number(reg_x-reg_y))
            {
                console.log("Test Failed: Arithmetic(x=y)");
                errors[16]++;
            }
        }
    }
    console.log("Test Completed");
    
}
var SHR_XY = function()
{
   console.log("<b>Testing Opcode: 8XY6</b>");
   ran_reg();
   for(i=0; i<16; i++)
   {
       var k_1 = Math.floor((Math.random() * 14) + 1);
       var k_2 = Math.floor((Math.random() * 14) + 1);
       var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "6";
       var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
       var reg_y = Processor.Registers[(opcode & 0x0F00)>>>4];
       var sb = Processor.Registers[(opcode & 0x0F00)>>>8] & 0x1;
       Processor.execute(opcode);
       if(k_2 != 15)
       {
            if(Processor.Registers[0xF] != Number(sb))
            {
                console.log("Test Failed: Invalid VF");
                errors[17]++;
            }
       }
       else if(k_2 ==15)
       {
           if(Processor.Registers[0xF] != Math.floor(reg_x/2))
           {
               console.log("Test Failed: Invalid VF");
               errors[17]++;
           }
       }

       if( k_1 != k_2)
       {
            if(Processor.Registers[(opcode & 0x00F0)>>>4] != Math.floor(Processor.Registers[(opcode & 0x0F00)>>>8]/2))
            {
                console.log("Test Failed: Invalid VY");
               errors[17]++;
            }
       }
   }
   console.log("Test Completed");
}
var SUBN = function()
{
    console.log("<b>Testing Opcode: 8XY7</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "7";
        var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
        var reg_y = Processor.Registers[(opcode & 0x00F0)>>>4];
        Processor.execute(opcode);
        if(Number(reg_x)<Number(reg_y))
        {
            if(Processor.Registers[0xF] != 1)
            {
                console.log("Test Failed: Overflow Error");
                errors[18]++;
            } 
        }
        else if(Number(reg_x)>Number(reg_y))
        {
            if(Number(Processor.Registers[k_1]) != Number(reg_y-reg_x)+256)
            {
                console.log("Test Failed: Arithmetic(x<y)");
                errors[18]++;
            }
        }
        else
        {
            if(Number(Processor.Registers[k_1]) != Number(reg_y-reg_x))
            {
                console.log("Test Failed: Arithmetic(x=y)");
                errors[18]++;
            }
        }
    }
    console.log("Test Completed");
}
var SHL = function()
{
    console.log("<b>Testing Opcode: 8XYE</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0x" + "8" + hex_convert(k_1) + hex_convert(k_2) + "E";
        Processor.execute(opcode);
        if(k_1 != k_2) 
        {
            if(Processor.Registers[0xF] != ((Processor.Registers[(opcode & 0x0F00)>>>8])& 0x80)>>>7)
            {
                console.log("Testing Failed: Invalid VF");
                errors[19]++;
            }
        }
        if( Processor.Registers[(opcode & 0x0F00)>>>8] >= Processor.Registers[(opcode & 0x00F0)>>>4])
        {
            console.log("x>=y");
        }
        else
        {
            if(Processor.Registers[(opcode & 0x00F0)>>>4] != ((Processor.Registers[(opcode & 0x0F00)>>>8])*2))
            {
    
                console.log("Testing Failed: Invalid VY");
                errors[19]++;
            }
        }
    }
    console.log("Test Completed");
}
var skip_inst_1 = function()
{
    console.log("<b>Testing Opcode: 3XKK</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var prev_pc = Processor.PC;
        var opcode = "0x" + "3" + hex_convert(i) + hex_convert(k_1) + hex_convert(k_2);
        Processor.execute(opcode);
        if(Processor.Registers[i] == Number(opcode & 0x00FF))
        {
            if(Processor.PC != prev_pc+2)
            {
                console.log("Test Failed: Vx == KK, but PC did not increase");
                errors[20]++;
            }
        }
        else 
        {
            if(Processor.PC != prev_pc)
            {
                console.log("Test Failed: Vx != KK, but PC increased");
                errors[20]++;
            }
        }
    }
    console.log("Test Completed");
    
}
var skip_inst_4 = function()
{
    console.log("<b>Testing Opcode: 9XY0</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var prev_pc = Processor.PC;
        var opcode = "0x9"  + hex_convert(k_1) + hex_convert(k_2) + "0";
        var reg_x = Processor.Registers[(opcode & 0x0F00)>>>8];
        var reg_y = Processor.Registers[(opcode & 0x00F0)>>>4];
        Processor.execute(opcode);
        if(Number(reg_x) != Number(reg_y))
        {
            if(Processor.PC != prev_pc+2)
            {
                console.log("Test Failed: Vx != KK, but PC did not increase");
                errors[21]++;
            }
        }
        else 
        {
            if(Processor.PC != prev_pc)
            {
                console.log("Test Failed: Vx == KK, but PC increased");
                errors[21]++;
            }
        }
    }
    console.log("Test Completed");
}
var ANNN = function()
{
    console.log("<b>Testing Opcode: ANNN</b>")
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var k_3 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0xA"  + hex_convert(k_1) + hex_convert(k_2) + hex_convert(k_3);
        Processor.execute(opcode);
        if(Processor.ISpecial != (opcode & 0x0FFF))
        {
            console.log("Test Failed");
            errors[22]++;
        }
    }
    console.log("Test Completed");
}
var BNNN = function()
{
    console.log("<b>Testing Opcode: BNNN</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var k_3 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0xB"  + hex_convert(k_1) + hex_convert(k_2) + hex_convert(k_3);
        Processor.execute(opcode);
        if(Processor.PC != (opcode & 0x0FFF)+Processor.Registers[0])
        {
            console.log("Test Failed");
            errors[23]++;
        }
    }
    console.log("Test Completed");
}
var CXNN = function()
{
    console.log("<b>Testing Opcode: CXNN</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var k_1 = Math.floor((Math.random() * 14) + 1);
        var k_2 = Math.floor((Math.random() * 14) + 1);
        var opcode = "0xC" + hex_convert(i) + hex_convert(k_1) + hex_convert(k_2);
        prev_reg = Processor.Registers[i];
        Processor.execute(opcode);
        if(prev_reg == Processor.Registers[i])
        {
            console.log("Test Failed");
            errors[24]++;
        }
    }
    console.log("Test Complete");   
}
var skip_inst_5 = function()
{
    console.log("<b>Testing Opcode: EX9E</b>");
    // Cannot be tested automatically because it involves a keypress
}
var skip_inst_6 = function()
{
    console.log("<b>Testing Opcode: EXA1</b>");   
    // Cannot be tested automatically because it involves a keypress
}
var VxtoDT = function()
{
    console.log("<b>Testing Opcode: FX07</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var opcode = "0xF" + hex_convert(i) + "07";
        Processor.execute(opcode);
        if(Processor.delayTimer != Processor.Registers[(opcode&0x0F00)>>>8])
        {
            console.log("Test Failed");
            errors[27]++;
        }
    }    
    console.log("Test Completed");
}
var WaitSetVxtoKeyDown = function()
{
    console.log("<b>Testing Opcode: FX0A</b>");
    // Cannot be tested automatically because it involves a keypress 
}
var SetDelayTimer_VxTODT = function()
{
    console.log("<b>Testing Opcode: FX15</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var opcode = "0xF" + hex_convert(i) + "15";
        Processor.execute(opcode);
        if(Processor.delayTimer != Processor.Registers[(opcode&0x0F00)>>>8])
        {
            console.log("Test Failed");
            errors[29]++;
        }
    }    
    console.log("Test Completed");
}
var SetSoundTimer_VxTOST = function()
{
    console.log("<b>Testing Opcode: FX18</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var opcode = "0xF" + hex_convert(i) + "18";
        Processor.execute(opcode);
        if(Processor.soundTimer != Processor.Registers[(opcode&0x0F00)>>>8])
        {
            console.log("Test Failed");
            errors[30]++;
        }
    }    
    console.log("Test Completed");
}
var AddVxIStore = function()
{
    console.log("<b>Testing Opcode: FX1E</b>");
    ran_reg();
    for(i=0; i<16; i++)
    {
        var opcode = "0xF" + hex_convert(i) + "1E";
        prev_I = Processor.ISpecial;
        Processor.execute(opcode);
        if(Processor.ISpecial != Processor.Registers[i]+prev_I)
        {
            console.log("Test Failed");
            errors[31]++;
        }
    }
    console.log("Test Completed");
}
var StoreBCDRepVx = function()
{
    console.log("<b>Testing Opcode: FX33</b>");
    ran_reg();
    Processor.ISpecial = Math.floor((Math.random() * 1000) + 512);
    for(i=0; i<16; i++)
    {
        var opcode = "0xF" + hex_convert(i) + "33";
        Processor.execute(opcode);
        var vx = Processor.Registers[i];
        var a = Math.floor(vx / 100);
        var b = Math.floor((vx % 100) / 10); 
        var c = Math.floor((vx % 10) / 1); 
        if(Processor.Memory[Processor.ISpecial] != a)
        {
            console.log("Test Failed: A");
            errors[32]++;
        }
        if(Processor.Memory[Processor.ISpecial+1] != b)
        {
            console.log("Test Failed: B");
            errors[32]++;
        }
        if(Processor.Memory[Processor.ISpecial+2] != c)
        {
            console.log("Test Failed: C");
            errors[32]++;
        }
    }
    console.log("Test Completed");
}
var StoreV0VxtoMemory = function()
{
    console.log("<b>Testing Opcode: FX55</b>");
    ran_reg();
    Processor.ISpecial = Math.floor((Math.random() * 1000) + 512);
    for(i=0; i<16; i++)
    {
        prev_I = Processor.ISpecial;
        var opcode = "0xF" + hex_convert(i) + "55";
        Processor.execute(opcode);
        if((prev_I + (i+1)) != Processor.ISpecial)
        {
            console.log("Test Failed: invalid I");
            errors[33]++;
        }
        for(j=0; j <= i; j++)
        {
            if(Processor.Memory[prev_I+j] != Processor.Registers[j])
            {
                console.log("Test Failed: Invalid Placement in Memory");
                errors[33]++;
            }
        }
    }
    console.log("Test Completed");
}
var ReadMemoryWriteV0Vx = function()
{
    console.log("<b>Testing Opcode: FX65</b>");
    ran_reg();
    Processor.ISpecial = Math.floor((Math.random() * 1000) + 512);
    for(i=0; i<16; i++)
    {
        prev_I = Processor.ISpecial;    
        var opcode = "0xF" + hex_convert(i) + "65";
        Processor.execute(opcode);
        if((prev_I + (i+1)) != Processor.ISpecial)
        {
            console.log("Test Failed: invalid I");
            errors[34]++;
        }
        for(j=0; j <= i; j++)
        {
            if(Processor.Memory[prev_I+j] != Processor.Registers[j])
            {
                console.log("Test Failed: Invalid Placement in Memory");
                errors[34]++;
            }
        }
    }
    console.log("Test Completed");
}