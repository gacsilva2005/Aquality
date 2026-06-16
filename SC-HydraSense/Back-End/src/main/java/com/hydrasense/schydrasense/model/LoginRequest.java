package com.hydrasense.schydrasense.model;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
public class LoginRequest {

    private String email;
    private String senha;
    private String tipoUsuario;

}