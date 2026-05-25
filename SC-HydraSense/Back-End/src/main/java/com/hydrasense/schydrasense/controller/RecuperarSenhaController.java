package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.RecuperarSenhaRequestDTO;
import com.hydrasense.schydrasense.service.RecuperarSenhaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/recuperar-senha")
public class RecuperarSenhaController {

    private final RecuperarSenhaService recuperarSenhaService;

    public RecuperarSenhaController(RecuperarSenhaService recuperarSenhaService) {
        this.recuperarSenhaService = recuperarSenhaService;
    }

    @PostMapping("/enviar-codigo")
    public ResponseEntity<Void> enviarCodigo(@RequestBody RecuperarSenhaRequestDTO request) {
        System.out.println("EMAIL RECEBIDO: " + request.email());

        recuperarSenhaService.enviarCodigo(request.email());

        return ResponseEntity.ok().build();
    }
}