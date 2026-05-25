package com.hydrasense.schydrasense.service;

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
        String codigo = String.valueOf(new Random().nextInt(900000) + 100000);

        CodigoRecuperacaoSenha recuperacao = new CodigoRecuperacaoSenha();
        recuperacao.setEmail(email);
        recuperacao.setCodigo(codigo);
        recuperacao.setExpiracao(LocalDateTime.now().plusMinutes(10));
        recuperacao.setUsado(false);

        codigoRepository.save(recuperacao);

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(email);
        mensagem.setSubject("Código de recuperação de senha - HydraSense");
        mensagem.setText("Seu código de recuperação é: " + codigo + "\n\nEle expira em 10 minutos.");

        mailSender.send(mensagem);
    }
}