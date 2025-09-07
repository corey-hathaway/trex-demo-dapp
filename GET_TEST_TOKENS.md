# 🪙 Getting PAS Test Tokens for Paseo Testnet

## 📋 **Step-by-Step Guide**

### 1. **Access the Faucet**
Visit the official Paseo testnet faucet:
**🔗 [Paseo Faucet](https://paritytech.github.io/polkadot-testnet-faucet/)**

### 2. **Select the Correct Chain**
- In the "Chain" dropdown, select: **"Passet Hub: smart contracts"**
- This is important because we're deploying smart contracts

### 3. **Enter Your Wallet Address**
- Copy your Polkadot wallet address (the one you're using in the dApp)
- Paste it into the address field
- Click "Request tokens"

### 4. **Verify Token Receipt**
- Check your wallet balance
- You should receive PAS tokens for testing
- These are free test tokens with no real value

## 🔧 **Alternative Methods**

### **Method 1: Polkadot.js Apps**
1. Go to [Polkadot.js Apps](https://polkadot.js.org/apps/)
2. Connect to "Passet Hub" network
3. Use the faucet tab to request tokens

### **Method 2: Direct RPC Call**
```bash
curl -X POST "https://testnet-passet-hub.polkadot.io" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "system_account",
    "params": ["YOUR_WALLET_ADDRESS"],
    "id": 1
  }'
```

## 💡 **Tips**

- **Request tokens multiple times** if you need more for testing
- **Keep some tokens** for gas fees during deployment
- **Test with small amounts** first before large deployments
- **Passet Hub is temporary** - tokens won't transfer to mainnet

## 🚨 **Important Notes**

- ⚠️ **Passet Hub is temporary** - contracts deployed here will NOT migrate to mainnet
- 🆓 **Test tokens are free** - no real money involved
- 🔄 **Can request multiple times** - faucet has limits but resets
- 🧪 **Perfect for testing** - safe environment for development

## 🎯 **Next Steps**

Once you have PAS tokens:
1. ✅ Connect your wallet to the dApp
2. ✅ Verify you have PAS balance
3. ✅ Try deploying a test token
4. ✅ Check the transaction on the explorer

---

**Need Help?** Check the [Paseo documentation](https://docs.polkadot.com/develop/networks) or [Polkadot forum](https://forum.polkadot.network/)
