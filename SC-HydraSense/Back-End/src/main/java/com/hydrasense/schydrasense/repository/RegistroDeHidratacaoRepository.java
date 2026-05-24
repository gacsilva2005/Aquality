package com.hydrasense.schydrasense.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hydrasense.schydrasense.model.RegistroDeHidratacao;
import java.util.List;

public interface RegistroDeHidratacaoRepository extends JpaRepository<RegistroDeHidratacao, Long> {
    List<RegistroDeHidratacao> findByAtletaId(Long atletaId);
}
