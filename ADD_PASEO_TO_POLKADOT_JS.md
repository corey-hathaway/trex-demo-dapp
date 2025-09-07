# 🔗 Adding Paseo Asset Hub to Polkadot.js Apps

## 📋 **Step-by-Step Guide**

### **Method 1: Manual Network Addition**

1. **Open Polkadot.js Apps**
   - Go to [https://polkadot.js.org/apps](https://polkadot.js.org/apps)

2. **Access Network Settings**
   - Click on the network dropdown (top left)
   - Select "Add custom endpoint"

3. **Add Paseo Asset Hub**
   - **Name**: `Paseo Asset Hub`
   - **RPC Endpoint**: `wss://passet-hub-paseo.ibp.network`
   - Click "Save"

4. **Switch to Paseo Asset Hub**
   - Select "Paseo Asset Hub" from the network dropdown
   - Wait for connection to establish

### **Method 2: Direct URL Access**

Visit this direct link to Polkadot.js Apps with Paseo Asset Hub pre-configured:
**🔗 [Polkadot.js Apps - Paseo Asset Hub](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpasset-hub-paseo.ibp.network#/explorer)**

### **Method 3: Alternative Endpoints**

If the primary endpoint doesn't work, try these alternatives:

- **IBP Network**: `wss://passet-hub-paseo.ibp.network`
- **Dwellir**: `wss://paseo-rpc.dwellir.com`
- **Amforc**: `wss://paseo.rpc.amforc.com:443`

## 🧪 **Testing the Connection**

### **1. Verify Network Info**
Once connected, you should see:
- **Network**: Paseo Asset Hub
- **Chain**: `passet-hub`
- **Token**: PAS
- **Decimals**: 10

### **2. Check Account Balance**
- Go to "Accounts" tab
- Your wallet should show PAS balance
- If no balance, use the faucet

### **3. Test Faucet**
- Go to "Accounts" → "Faucet" tab
- Request PAS tokens for testing
- Select "Passet Hub: smart contracts" if prompted

## 🔧 **Troubleshooting**

### **Connection Issues**
- **Try different endpoints** from the list above
- **Clear browser cache** and refresh
- **Check if endpoint is down** by testing in browser console

### **Network Not Found**
- **Manually add** using Method 1 above
- **Use direct URL** from Method 2
- **Check Polkadot.js Apps version** (should be latest)

### **Faucet Issues**
- **Try different faucet**: [Parity Faucet](https://paritytech.github.io/polkadot-testnet-faucet/)
- **Select correct chain**: "Passet Hub: smart contracts"
- **Wait for confirmation** before requesting more tokens

## 📱 **Mobile/App Users**

### **Polkadot.js Extension**
- Open Polkadot.js Extension
- Go to Settings → Networks
- Add custom network with endpoint: `wss://passet-hub-paseo.ibp.network`

### **Talisman Wallet**
- Open Talisman
- Go to Settings → Networks
- Add "Paseo Asset Hub" with the WebSocket endpoint

## 🎯 **Next Steps**

Once connected to Paseo Asset Hub:

1. ✅ **Verify connection** - Check network info
2. ✅ **Get test tokens** - Use faucet to get PAS
3. ✅ **Test our dApp** - Connect wallet and test deployment
4. ✅ **Deploy tokens** - Try the T-REX token deployment

## 🔗 **Useful Links**

- **Polkadot.js Apps**: [https://polkadot.js.org/apps](https://polkadot.js.org/apps)
- **Paseo Faucet**: [https://paritytech.github.io/polkadot-testnet-faucet/](https://paritytech.github.io/polkadot-testnet-faucet/)
- **Paseo Documentation**: [https://docs.polkadot.com/develop/networks](https://docs.polkadot.com/develop/networks)
- **Paseo Forum**: [https://forum.polkadot.network/t/testnets-paseo-officially-becomes-the-polkadot-testnet-temporary-passet-hub-chain-for-smart-contracts-testing/13209](https://forum.polkadot.network/t/testnets-paseo-officially-becomes-the-polkadot-testnet-temporary-passet-hub-chain-for-smart-contracts-testing/13209)

---

**Need Help?** If you're still having issues, try the direct URL method or check the Polkadot forum for the latest endpoint information.
