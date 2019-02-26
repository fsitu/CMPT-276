function updateVisualizer()
{
    for (let i = "0"; i <= 15; i++)
    {
        document.getElementById("V" + i).innerHTML = "V" + i + ": " + Processor.Registers[i];
    }
}