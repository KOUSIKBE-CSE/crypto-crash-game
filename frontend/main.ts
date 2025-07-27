const fetchBtn = document.getElementById("fetchBtn") as HTMLButtonElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;

fetchBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter a username");

  try {
    const res = await fetch(`/api/wallet/${username}`);
    const data = await res.json();

    (document.getElementById("walletInfo") as HTMLElement).classList.remove("d-none");

    (document.getElementById("btcCrypto") as HTMLElement).textContent = data.BTC.crypto.toFixed(6);
    (document.getElementById("btcUsd") as HTMLElement).textContent = data.BTC.usd.toFixed(2);

    (document.getElementById("ethCrypto") as HTMLElement).textContent = data.ETH.crypto.toFixed(6);
    (document.getElementById("ethUsd") as HTMLElement).textContent = data.ETH.usd.toFixed(2);
  } catch (error) {
    alert("Failed to fetch wallet info 😞");
    console.error(error);
  }
});
