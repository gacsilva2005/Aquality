package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.Usuario;
import com.hydrasense.schydrasense.repository.UsuarioRepository;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UsuarioRepository usuarioRepository;

    public CustomOAuth2UserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User oAuth2User = super.loadUser(request);

        String nome = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        String foto = oAuth2User.getAttribute("picture");

        usuarioRepository.findByEmail(email)
                .orElseGet(() -> usuarioRepository.save(
                        new Usuario(nome, email, foto, "GOOGLE")
                ));

        return oAuth2User;
    }
}