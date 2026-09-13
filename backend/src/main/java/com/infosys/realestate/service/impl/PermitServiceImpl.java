package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PermitRequest;
import com.infosys.realestate.dto.PermitResponse;
import com.infosys.realestate.entity.Permit;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.repository.PermitRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.service.PermitService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermitServiceImpl implements PermitService {

    private final PermitRepository permitRepository;
    private final PropertyRepository propertyRepository;

    public PermitServiceImpl(
            PermitRepository permitRepository,
            PropertyRepository propertyRepository) {

        this.permitRepository = permitRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public List<PermitResponse> getPermitsByPropertyId(Long propertyId) {

        return permitRepository
                .findByPropertyPropertyId(propertyId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PermitResponse createPermit(PermitRequest request) {

        Property property = propertyRepository
                .findById(request.getPropertyId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: "
                                        + request.getPropertyId()
                        ));

        Permit permit = new Permit();

        permit.setProperty(property);
        permit.setPermitNumber(request.getPermitNumber());
        permit.setPermitType(request.getPermitType());
        permit.setAuthority(request.getAuthority());
        permit.setStatus(request.getStatus());
        permit.setIssueDate(request.getIssueDate());
        permit.setApprovalDate(request.getApprovalDate());
        permit.setContractor(request.getContractor());
        permit.setInspector(request.getInspector());
        permit.setNotes(request.getNotes());

        Permit saved = permitRepository.save(permit);

        return convertToResponse(saved);
    }

    private PermitResponse convertToResponse(Permit permit) {

        PermitResponse response = new PermitResponse();

        response.setId(permit.getId());

        if (permit.getProperty() != null) {
            response.setPropertyId(
                    permit.getProperty().getPropertyId()
            );
        }

        response.setPermitNumber(permit.getPermitNumber());
        response.setPermitType(permit.getPermitType());
        response.setAuthority(permit.getAuthority());
        response.setStatus(permit.getStatus());
        response.setIssueDate(permit.getIssueDate());
        response.setApprovalDate(permit.getApprovalDate());
        response.setContractor(permit.getContractor());
        response.setInspector(permit.getInspector());
        response.setNotes(permit.getNotes());

        return response;
    }
}
