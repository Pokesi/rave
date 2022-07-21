export const truncateAddress = (address) => {
  address = address.substring(0, 12) + '...' + address.substring(address.length - 8, address.length)
  return address
}

export const shorten = (input) => {
  if (typeof input === "undefined") {
    return "";
  }
  return (input.length > 12) ? (input.substring(0, 12) + '...') : (input);
}
