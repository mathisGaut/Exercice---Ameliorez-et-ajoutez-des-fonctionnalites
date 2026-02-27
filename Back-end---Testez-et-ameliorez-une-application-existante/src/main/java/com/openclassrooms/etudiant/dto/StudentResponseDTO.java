package com.openclassrooms.etudiant.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
}
