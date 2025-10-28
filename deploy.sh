subnet_id=$(az network vnet subnet show --resource-group ati-portla-ui-sbox --vnet-name ati-portal-vnet --name ati-portal-container-subnet --query id --output tsv)

# Get the ACR login server and admin credentials
acr_name="atiportal"
az acr login --name $acr_name --expose-token
az acr update -n atiportal --admin-enabled true
acr_login_server=$(az acr show --name $acr_name --query loginServer --output tsv)
acr_username=$(az acr credential show --name $acr_name --query username --output tsv)
acr_password=$(az acr credential show --name $acr_name --query passwords[0].value --output tsv)

# Deploy the ACI
az container create \
  --resource-group ati-portla-ui-sbox \
  --name nestjs-aci \
  --image $acr_login_server/ati-webportal-api:localv6 \
  --registry-username $acr_username \
  --registry-password $acr_password \
  --vnet ati-portal-vnet \
  --subnet $subnet_id \
  --ports 3000 \
  --ip-address private
