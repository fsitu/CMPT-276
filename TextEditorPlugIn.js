function ModifyCode()
{
    var my_code = document.getElementById('key1').value;

    if (my_code == "123") // Example of analyse
    {
        document.getElementById('key2').style.visibility="visible";
        document.getElementById('key2').value = "Here will be output";
    }
    assemble(my_code);
}