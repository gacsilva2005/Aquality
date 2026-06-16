package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.CodigoRecuperacaoSenha;
import com.hydrasense.schydrasense.repository.CodigoRecuperacaoSenhaRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class RecuperarSenhaService {

    private final CodigoRecuperacaoSenhaRepository codigoRepository;
    private final JavaMailSender mailSender;

    public RecuperarSenhaService(
            CodigoRecuperacaoSenhaRepository codigoRepository,
            JavaMailSender mailSender
    ) {
        this.codigoRepository = codigoRepository;
        this.mailSender = mailSender;
    }

    public void enviarCodigo(String email) {
        try {

            String codigo = String.valueOf(new Random().nextInt(900000) + 100000);

            CodigoRecuperacaoSenha recuperacao = new CodigoRecuperacaoSenha();
            recuperacao.setEmail(email);
            recuperacao.setCodigo(codigo);
            recuperacao.setExpiracao(LocalDateTime.now().plusMinutes(10));
            recuperacao.setUsado(false);

            codigoRepository.save(recuperacao);

            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setTo(email);
            mensagem.setSubject("Código de recuperação");
            mensagem.setText("Seu código é: " + codigo);

            mailSender.send(mensagem);

            System.out.println("EMAIL ENVIADO COM SUCESSO");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    public boolean validarCodigo(String email, String codigo) {
        CodigoRecuperacaoSenha registro = codigoRepository
                .findTopByEmailAndCodigoAndUsadoFalseOrderByIdDesc(email, codigo)
                .orElseThrow(() -> new RuntimeException("Código inválido"));

        if (registro.getExpiracao().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código expirado");
        }

        return true;
    }
}