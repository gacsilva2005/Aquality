package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.AtletaRequestDTO;
import com.hydrasense.schydrasense.dto.ConviteAtletaDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hydrasense.schydrasense.dto.AtletaResumoDTO;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;

@Service
public class AtletaService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.hydrasense.schydrasense.repository.MetaHidratacaoRepository metaRepository;

    private final AtletaRepository repository;
    private final ClubeRepository clubeRepository;
    private final SessaoDeTreinoRepository sessaoDeTreinoRepository;
    private final CalculadoraFisiologica calculadoraFisiologica;

    public AtletaService(AtletaRepository repository, ClubeRepository clubeRepository,
            SessaoDeTreinoRepository sessaoDeTreinoRepository, CalculadoraFisiologica calculadoraFisiologica) {
        this.repository = repository;
        this.clubeRepository = clubeRepository;
        this.sessaoDeTreinoRepository = sessaoDeTreinoRepository;
        this.calculadoraFisiologica = calculadoraFisiologica;
    }

    private String gerarCodigo() {

        int numero = (int) (Math.random() * 900000) + 100000;

        return String.valueOf(numero);
    }

    public Atleta cadastrar(AtletaRequestDTO request) {

        if (request.getCodigoEquipe() == null || request.getCodigoEquipe().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Código de equipe é obrigatório.");
        }

        Clube clube = clubeRepository.findByCodigo(request.getCodigoEquipe())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Código de equipe inválido ou inexistente."));

        Atleta atleta = new Atleta();

        atleta.setNome(request.getNome());
        atleta.setEmail(request.getEmail());
        atleta.setSenha(request.getSenha());
        atleta.setDataNascimento(request.getDataNascimento());
        atleta.setPesoAtual(request.getPesoAtual());
        atleta.setModalidade("[]");
        atleta.setAltura(request.getAltura());
        atleta.setSexo(request.getSexo());

        atleta.setClube(clube);

        String codigo = gerarCodigo();

        atleta.setCodigoAcesso(codigo);

        Atleta atletaSalvo = repository.save(atleta);

        try {
            com.hydrasense.schydrasense.model.MetaHidratacao metaPadrao = new com.hydrasense.schydrasense.model.MetaHidratacao();
            metaPadrao.setAtleta(atletaSalvo);
            metaPadrao.setMetaVolumeMl(3000);
            metaPadrao.setObservacoes("Meta padrão inicial");
            metaRepository.save(metaPadrao);
        } catch (Exception e) {
            System.err.println("Erro ao criar meta de hidratação padrão: " + e.getMessage());
        }

        try {
            emailService.enviarCodigo(
                    atleta.getEmail(),
                    codigo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email: " + e.getMessage());
        }

        return atletaSalvo;
    }

    public Atleta login(String email, String senha) {

        Atleta atleta = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!atleta.getSenha().equals(senha)) {
            throw new RuntimeException("Senha inválida");
        }

        return atleta;
    }

    // Listar todos os atletas
    public List<Atleta> listarTodos() {
        return repository.findAll();
    }

    // Buscar atleta por ID
    public Optional<Atleta> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Deletar atleta
    public void deletar(Long id) {
        repository.deleteById(id);
    }

    // Enviar email para atleta
    public void enviarConvite(ConviteAtletaDTO dto) {

        String mensagem = """
                Oi %s!

                Parabéns, atleta!
                Você foi convidado para participar da equipe Engenharia Mauá.

                O seu código da equipe para cadastro no nosso aplicativo é: %s
                """
                .formatted(dto.getNome(), dto.getCodigoEquipe());

        emailService.enviarEmail(
                dto.getEmail(),
                "Convite HydraSense",
                mensagem);
    }

    // Atualizar dados do atleta
    public Atleta atualizar(Long id, Atleta atletaAtualizado) {
        return repository.findById(id)
                .map(atleta -> {
                    atleta.setNome(atletaAtualizado.getNome());
                    atleta.setDataNascimento(atletaAtualizado.getDataNascimento());
                    atleta.setPesoAtual(atletaAtualizado.getPesoAtual());
                    atleta.setSexo(atletaAtualizado.getSexo());
                    atleta.setFotoPerfil(atletaAtualizado.getFotoPerfil());
                    atleta.setModalidade(atletaAtualizado.getModalidade());
                    atleta.setAltura(atletaAtualizado.getAltura());
                    atleta.setKitPrincipalId(atletaAtualizado.getKitPrincipalId());
                    return repository.save(atleta);
                })
                .orElseThrow(() -> new RuntimeException("Atleta não encontrado"));
    }

    public List<SessaoDeTreino> listarPorAtleta(Long atletaId) {
        return sessaoDeTreinoRepository.findByAtletaId(atletaId);
    }

    public List<AtletaResumoDTO> listarResumosPorClube(Long clubeId) {
        List<Atleta> atletas = repository.findByClubeId(clubeId);
        
        return atletas.stream().map(atleta -> {
            AtletaResumoDTO dto = new AtletaResumoDTO();
            dto.setId(atleta.getId());
            dto.setNome(atleta.getNome());
            dto.setFotoPerfil(atleta.getFotoPerfil());
            dto.setModalidade(atleta.getModalidade());
            
            String equipeNomes = atleta.getEquipes() != null && !atleta.getEquipes().isEmpty()
                ? atleta.getEquipes().stream().map(e -> e.getNome()).collect(Collectors.joining(", "))
                : "Sem Equipe";
            dto.setEquipeNome(equipeNomes);
            
            dto.setAdesao("Alta"); // Valor mockado temporário conforme definido no plano
            
            List<SessaoDeTreino> sessoes = sessaoDeTreinoRepository.findByAtletaId(atleta.getId());
            if (sessoes != null && !sessoes.isEmpty()) {
                SessaoDeTreino ultimaSessao = sessoes.stream()
                        .filter(s -> s.getDataHoraFim() != null)
                        .max(Comparator.comparing(SessaoDeTreino::getDataHoraFim))
                        .orElse(null);
                        
                if (ultimaSessao != null) {
                    dto.setUltimaSessao(ultimaSessao.getDataHoraFim());
                    
                    Float pesoPre = ultimaSessao.getPesagemPre() != null ? ultimaSessao.getPesagemPre().getPeso() : null;
                    Float pesoPos = ultimaSessao.getPesagemPos() != null ? ultimaSessao.getPesagemPos().getPeso() : null;
                    
                    if (pesoPre != null && pesoPos != null && pesoPre > 0) {
                        double variacao = calculadoraFisiologica.calcularPercentualVariacaoMassa(pesoPre, pesoPos);
                        if (variacao < -2.0) {
                            dto.setStatus("Crítico");
                        } else if (variacao < -1.0) {
                            dto.setStatus("Atenção");
                        } else {
                            dto.setStatus("Ideal");
                        }
                    } else {
                        dto.setStatus("Sem Dados");
                    }
                } else {
                    dto.setStatus("Sem Dados");
                }
            } else {
                dto.setStatus("Sem Dados");
            }
            
            return dto;
        }).collect(Collectors.toList());
    }
}