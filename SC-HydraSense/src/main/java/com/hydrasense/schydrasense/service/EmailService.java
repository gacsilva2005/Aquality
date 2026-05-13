package com.hydrasense.schydrasense.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigo(String destino, String codigo) {

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(destino);
        mensagem.setSubject("Código de acesso HydraSense");

        mensagem.setText(
                "Seu código de acesso é: " + codigo +
                        "\n\nUse este código para ativar sua conta no sistema."
        );

        mailSender.send(mensagem);
    }

    public void enviarEmail(String destino, String assunto, String mensagem) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(destino);
        mail.setSubject(assunto);
        mail.setText(mensagem);

        mailSender.send(mail);
    }
}