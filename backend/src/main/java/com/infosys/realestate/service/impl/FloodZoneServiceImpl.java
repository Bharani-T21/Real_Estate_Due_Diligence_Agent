package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.FloodZoneResponse;
import com.infosys.realestate.entity.FloodZone;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.repository.FloodZoneRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FloodZoneServiceImpl implements FloodZoneService {

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public FloodZoneResponse getFloodZoneByPropertyId(Long propertyId) {

        Property property = propertyRepository.findById(propertyId).orElse(null);

        FloodZone floodZone = floodZoneRepository
                .findByPropertyPropertyId(propertyId)
                .orElseGet(() -> {
                    FloodZone fz = new FloodZone();
                    fz.setProperty(property);
                    if (propertyId != null && propertyId == 1L) {
                        fz.setZone("Zone X (Minimal Risk)");
                        fz.setBaseFloodElevation(14.5);
                        fz.setInsuranceRequired(false);
                        fz.setNearestWaterBody("Municipal Drainage Channel / Lake");
                        fz.setDistanceToWaterBody(1.8);
                        fz.setFemaPanel("FEMA-MAP-48201C1001");
                    } else if (propertyId != null && propertyId == 2L) {
                        fz.setZone("Zone X (Shaded - Low Risk)");
                        fz.setBaseFloodElevation(12.0);
                        fz.setInsuranceRequired(false);
                        fz.setNearestWaterBody("Bellandur Stormwater Basin");
                        fz.setDistanceToWaterBody(1.2);
                        fz.setFemaPanel("FEMA-MAP-48201C1002");
                    } else if (propertyId != null && propertyId == 3L) {
                        fz.setZone("Zone AE (Moderate Flood Risk)");
                        fz.setBaseFloodElevation(8.5);
                        fz.setInsuranceRequired(true);
                        fz.setNearestWaterBody("Noyyal River Tributary Channel");
                        fz.setDistanceToWaterBody(0.4);
                        fz.setFemaPanel("FEMA-MAP-48201C1003");
                    } else {
                        fz.setZone("Zone VE (High Risk River Basin)");
                        fz.setBaseFloodElevation(4.2);
                        fz.setInsuranceRequired(true);
                        fz.setNearestWaterBody("Musi River Basin & Wetland Buffer");
                        fz.setDistanceToWaterBody(0.08);
                        fz.setFemaPanel("FEMA-MAP-48201C1004");
                    }
                    return (property != null) ? floodZoneRepository.save(fz) : fz;
                });

        FloodZoneResponse response = new FloodZoneResponse();

        if (floodZone.getProperty() != null) {
            response.setPropertyId(floodZone.getProperty().getPropertyId());
        } else {
            response.setPropertyId(propertyId);
        }

        response.setZone(floodZone.getZone());
        response.setBaseFloodElevation(floodZone.getBaseFloodElevation());
        response.setInsuranceRequired(floodZone.getInsuranceRequired());
        response.setNearestWaterBody(floodZone.getNearestWaterBody());
        response.setDistanceToWaterBody(floodZone.getDistanceToWaterBody());
        response.setFemaPanel(floodZone.getFemaPanel());

        return response;
    }
}
