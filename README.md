# Swedish Historic Housing and Forest Coverage Datasets  


This repository provides datasets and accompanying resources for a study of historical housing construction techniques in Sweden and their relationship with historic forest coverage. 

The data can be explored via a custom web-tool: [The Forest/Timber map](https://erikarnell.se/forest-timber-map/web/)

<img width="800" alt="Map interface" src="https://github.com/user-attachments/assets/2cd82702-08f7-49d8-96aa-6f5314ac1150" />

## Overview
### House data
The first part of this project is dataset containing ~5000 records of buildings. The data is scraped from three major Swedish realtor websites during one day in 2023. 

### Forest data 
The second part is data about forest cover in the 1840s. This data has been extracted from a digitalisation of ["Skogskartan"](https://sok.riksarkivet.se/?ValdSortering=DatumStigande&PageSize=20&EndastDigitaliserat=False&FacettFilter=arkis_ark_typ_facet%24Karta%2Fritning%3A&typAvLista=Standard&AvanceradSok=True&Ort=Karlstads+stift&page=1&postid=Arkis+27cfdb7e-88b3-41ec-82da-fe1fe4babddc&tab=post&s=Balder) in the Swedish National Archive. This map has been georeferenced and processed to be computable. 

### Analysis



## Datasets  

### House Data  
The house data was collected by scraping non-apartement property listnings from three major Swedish realtor websites. The data was then indexed/cleaned. If the building technique of the frame was specified this has been extracted and modeled into a taxonomy described in the data model. This taxonomy contains different building techniques with a focus on wooden materials.

Realtor 1            |  Realtor 2      |  Realtor 3      |  Example house     
-------------------------|-------------------------|-------------------------|-------------------------
 ![R1](https://github.com/user-attachments/assets/75b0e328-93d3-4973-8b0c-de78ef1e0e98)| ![R2](https://github.com/user-attachments/assets/8f85e9ca-4d4a-45c5-9694-8b189a7c24be) |![R3](https://github.com/user-attachments/assets/e52e583f-35af-442e-8449-c1daf610d710) | ![HOUSE](https://github.com/user-attachments/assets/f2f418c6-86e2-4274-b077-b83f7ef755c7)



| **Name**                  | **Type**   | **Example value**         | **Description**                                             |
|---------------------------|------------|---------------------------|-------------------------------------------------------------|
| **Location**              |            |                           |                                                             |
| Latitude                  | Float      | 59.493942                 | Latitude in WGS 84                                          |
| Longitude                 | Float      | 17.947475                 | Longitude in WGS 84                                         |
| County                    | String     | Skåne                     | Region name                                                 |
| **Date**                  |            |                           |                                                             |
| Year of construction      | Date       | 1820-01-01                | Year of construction in date format.                       |
| **Frame**                 |            |                           |                                                             |
| Frame_wood                | Bool       | FALSE                     | If word "wood" is used in Frame                             |
| Frame_wood_beams          | Bool       | FALSE                     | If "wood beams" or similar is mentioned in Frame           |
| Frame_wood_logs           | Bool       | TRUE                      | If "logs" or similar is mentioned in Frame                 |
| Frame_wood_planks         | Bool       | FALSE                     | If "planks" or similar is mentioned in Frame               |
| Frame_wood_saving         | Bool       | TRUE                      | If wood saving techniques are mentioned in Frame           |
| Frame_concrete            | Bool       | FALSE                     | If "concrete" or similar is mentioned in Frame             |
| Frame_concrete_aerated    | Bool       | FALSE                     | If "aerated concrete" or similar is mentioned in Frame     |
| Frame_stone               | Bool       | TRUE                      | If "stone" or similar is mentioned in Frame                |
| Frame_bricks              | Bool       | FALSE                     | If "bricks" or similar is mentioned in Frame               |
| Frame_bricks_leca         | Bool       | FALSE                     | If "leca" or similar is mentioned in Frame                 |
| Frame_bricks_adobe        | Bool       | TRUE                      | If "adobe" or similar is mentioned in Frame                |
| Frame_steel               | Bool       | FALSE                     | If "steel" or similar is mentioned in Frame                |
| Frame                     | String     | Sannolik lersten med  <br />korsvirke samt gråsten. <br />Annat material kan  <br />förekomma. | Original frame description from property listing.          |

### Forest Coverage Data  

- **Description**: Historical forest coverage in Sweden, categorized by forest type.  
- **Formats**:  
  - `GeoTIFF`: Raster format for precise geospatial analysis.  
  - `GeoJSON`: Vectorized version for integration into GIS tools.  

---
