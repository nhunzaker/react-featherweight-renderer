let bank = {}

export default  {

  get (key) {
    return bank[key]
  },

  set (key, value) {
    bank[key] = value
  }

}
