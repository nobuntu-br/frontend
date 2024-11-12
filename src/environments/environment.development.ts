export const environment = { 
    applicationTitle: "Projeto Formulario", 
    backendUrl: "http://localhost:8080", 
    frontendUrl: "https://localhost:4200", 
    menuPath: "../../../../assets/dicionario/menu/menu.json", 
    jsonPath: "../../../../assets/dicionario/", 

    // Dados Relacionados ao Azure AD B2C 
    authority: 'https://allystore.b2clogin.com/b46b5b87-a08e-487b-ae9b-fec172a9a90b/b2c_1_entradaEcadastro/v2.0/', 
    client_id:'46513151-51f8-4912-8051-8de83c3ef9ed', 
    redirect_uri: 'callback',
    post_logout_redirect_uri: 'logout',
    scope: 'https://allystore.onmicrosoft.com/46513151-51f8-4912-8051-8de83c3ef9ed/test.read openid',

    tenant_id: 'b46b5b87-a08e-487b-ae9b-fec172a9a90b', 
    provider: 'allystore.b2clogin.com', 

    signInPolitical: 'b2c_1_entradaEcadastro', 
    passwordResetPolitical: 'b2c_1_password_reset', 
    profileEditPolitical: 'b2c_1_profile_edit', 

    formularioJSONPath: '../../../../assets/dicionario/formulario.json', 

    itemDoFormularioJSONPath: '../../../../assets/dicionario/itemDoFormulario.json', 

    sessaoDoFormularioJSONPath: '../../../../assets/dicionario/sessaoDoFormulario.json', 

    alternativaJSONPath: '../../../../assets/dicionario/alternativa.json', 

    registroDoFormularioJSONPath: '../../../../assets/dicionario/registroDoFormulario.json', 

    detalhesDoRegistroJSONPath: '../../../../assets/dicionario/detalhesDoRegistro.json', 

    transmissaoJSONPath: '../../../../assets/dicionario/transmissao.json', 

    usuarioDoFormularioJSONPath: '../../../../assets/dicionario/usuarioDoFormulario.json', 
};
