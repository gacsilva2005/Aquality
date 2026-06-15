package com.hydrasense.schydrasense.config;

import com.hydrasense.schydrasense.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults()) // Mantém o CORS do seu amigo
                .authorizeHttpRequests(auth -> auth
                        // Permite TODAS as requisições temporariamente (Bypass Faculdade)
                        .anyRequest().permitAll()
                );
                // COMENTADO TEMPORARIAMENTE A PEDIDO DO USUÁRIO
                /*
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(user -> user
                                .userService(customOAuth2UserService)
                        )
                        .defaultSuccessUrl("http://localhost:5173/PageWeb", true)
                );
                */

        return http.build();
    }
}