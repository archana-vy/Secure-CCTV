App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const secureCCTV = await $.getJSON('SecureCCTV.json')
    App.contracts.SecureCCTV = TruffleContract(secureCCTV)
    App.contracts.SecureCCTV.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.secureCCTV = await App.contracts.SecureCCTV.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    //Update BC 
    // await App.addVideo()

    // Render Tasks
    await App.renderVideo()

    // Update loading state
    App.setLoading(false)
  },

  renderVideo: async () => {
    // Load the total task count from the blockchain
    const videoCount = 10
    const $videoTemplate = $('.videoTemplate')
    var count = 0
    const encryptedHashs = ['0x99fDFC9ef7873657c2bC3F63A213f9227EEE51c4',
    '0xcE4F757A8ac7CCb0f207010ae4CEBb6100a6dC20',
    '0x108E71443Df728e3cb0467B6707b02f97Fe336c4',
    '0x8d128904CFc87e20aB39Aa967b4121598Ef725d8',
    '0x59248dd22B7f2D84Dd529C226Fe3588EB20a019D',
    '0x31dDE6C06a3E225B90D5614B37829e1B823Ba83f',
    '0x880640C6f02726C58133922B81a6AB2d30eB1799',
    '0x369914D64fC96EC246A313fE845d7DeE0E52f1fa',
    '0x8827e11eB76716fbF5fa595a021073A04e31B32B',
    '0xD12211bA90D742e3383e4Ce8F87C9D69AE853c49',]
    // Render out each task with a new task template
    for(var i = 0; i < videoCount; i++) {
      // Fetch the video data from the blockchain
      // const video = await App.secureCCTV.videos(i)
      const videoId = Date.now()
      const encryptedHash = encryptedHashs[count++]
      
      if(count === 10) {
        count = 0;
      }

      // Create the html for the video
      const $newVideoTemplate = $videoTemplate.clone()
      $newVideoTemplate.find('.content').html(encryptedHash)
      $newVideoTemplate.find('.input').html(videoId)

      // Put the video in the  list
      $('#videoList').append($newVideoTemplate)

      // Show the video
      $newVideoTemplate.show()
    }
  },

  addVideo: async () => {
    App.setLoading(true)
    var count = 0
    var id
    const encryptedHashs = ['0x99fDFC9ef7873657c2bC3F63A213f9227EEE51c4',
    '0xcE4F757A8ac7CCb0f207010ae4CEBb6100a6dC20',
    '0x108E71443Df728e3cb0467B6707b02f97Fe336c4',
    '0x8d128904CFc87e20aB39Aa967b4121598Ef725d8',
    '0x59248dd22B7f2D84Dd529C226Fe3588EB20a019D',
    '0x31dDE6C06a3E225B90D5614B37829e1B823Ba83f',
    '0x880640C6f02726C58133922B81a6AB2d30eB1799',
    '0x369914D64fC96EC246A313fE845d7DeE0E52f1fa',
    '0x8827e11eB76716fbF5fa595a021073A04e31B32B',
    '0xD12211bA90D742e3383e4Ce8F87C9D69AE853c49',]
    //while(count < 2) {
      id = 'test' + Date.now() + count + 'mp4'
      hash = encryptedHashs[count++]
      await App.secureCCTV.addVideo(id, hash)
      window.location.reload()
    //}
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})