quantidade.addEventListener('input', event => {
    var quantidadeValue = event.target.value


  unitario.addEventListener('input', event => {
    var unitarioValue = event.target.value

  
    var totalValue = (Number(quantidadeValue) * Number(unitarioValue))
    console.log(totalValue)
    document.getElementById('total').value = totalValue;


  })
})