package com.hydrasense.schydrasense.repository;

import com.hydrasense.schydrasense.model.CodigoRecuperacaoSenha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodigoRecuperacaoSenhaRepository extends JpaRepository<CodigoRecuperacaoSenha, Long> {

    Optional<CodigoRecuperacaoSenha> findTopByEmailAndCodigoAndUsadoFalseOrderByIdDesc(
            String email,
            String codigo
    );
}