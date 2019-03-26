function ModifyCode(){
    
    var my_code = document.getElementById('key1').value;

    if (my_code[0] == "J" && my_code[1]== "P") 
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  1"+my_code[3]+my_code[4]+my_code[5] +"  Comment: JP addr Jump to location nnn. The interpreter sets the program counter to nnn.";
    }

    if (my_code[0] == "C" && my_code[1]== "A" && my_code[2]== "L" && my_code[3]== "L") 
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  2"+my_code[5]+my_code[6]+my_code[7] +"  Comment: The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn."
        
    }
    
    if(my_code[0] == "S" && my_code[1] == "E"){
        
        if(my_code[6] == "b"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  3"+my_code[3] + "kk";
        }
        else{
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  5"+my_code[3]+my_code[6] + "0";
        }
    }

    if(my_code[0] == "L" && my_code[1] == "D"){
        
        if(my_code[6] == "b"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  6"+my_code[3] + "kk";
        }

        if(my_code[6] == "D" && my_code[7] == "T"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[3] + "07";
        }

        if(my_code[6] == "K"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[3] + "0A";
        }

        if(my_code[3] == "D" && my_code[4] == "T"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[7] + "15";
        }

        if(my_code[3] == "S" && my_code[4] == "T"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[7] + "18";
        }

        if(my_code[3] == "F"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[6] + "29";
        }

        if(my_code[3] == "B"){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[6] + "33";
        }

        if(my_code[3] == "["){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[8] + "55";
        }

        if(my_code[6] == "["){
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  F"+my_code[3] + "65";
        }

        else{
            document.getElementById('key2').style.visibility="visible";
            document.getElementById('key2').value = "Your Opcode:  8"+my_code[3]+my_code[6] + "0";
        }
    }

    if(my_code[0] == "O" && my_code[1] == "R"){
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  8"+my_code[3]+my_code[6] + "1";    
    }


    if (my_code[0] == "R" && my_code[1]== "N" && my_code[2] == "D") 
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  C"+my_code[4]+"kk";
    }

    if (my_code[0] == "D" && my_code[1]== "R" && my_code[2] == "W") 
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  D"+my_code[4]+my_code[7]+my_code[10];
    }
    
    if (my_code[0] == "S" && my_code[1]== "K" && my_code[2] == "P") 
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  E"+my_code[4]+"9E";
    }

    if (my_code[0] == "S" && my_code[1]== "K" && my_code[2] == "N" && my_code[3] == "P") 
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  E"+my_code[5]+"A1";
    }

    if (my_code[0] == "A" && my_code[1]== "D" && my_code[2] == "D") 
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Your Opcode:  F"+my_code[4]+"1E";
    }

}
