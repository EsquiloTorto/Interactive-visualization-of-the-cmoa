BREVE INTRODUCAO 
Este projeto visa, através de 3 principais visualizações, criar experiências interativas e imersivas que permitem aos usuários mergulhar em um universo de expressão artística. Assim, a abordagem apresentada busca proporcionar uma nova maneira de apreciar as artes, ampliando os horizontes e incentivando a exploração de diferentes estilos, técnicas e artistas. Com isso, nos baseamos em duas bases de dados [CMOA Collection Github](https://github.com/cmoa/collection) e o 
[CMOA Collection Kaggle](https://www.kaggle.com/datasets/mfrancis23/carnegie-museum-of-art). Mas, no geral foi-se usado a base de dados contida no github, que por mais que estivesse mais desatualizada, tinha mais informações sobre as obras e artistas.

FALAR DA PAGINA EM GERAL

DIVISAO DE TAREFAS:
KAYO:
Kayo, primeiramente foi responsável por fazer parte do webscrapping, lapidar e repadronizar os dados para uso posterior. Em seguida, foi autor da primeira visualização (CMOA Fragments), ajudou com algumas funcionalidades técnincas gerais do das visualizações, responsividade e visual das páginas. Com isso, na síntese da visualização teve como a ideia inicial de fazer um grid infinito como o que se encontra aqui [Infinite Grid](https://codepen.io/radixzz/pen/eRJKXy), porém esta abordagem so leva em consideração tamanhos idênticos das imagens, assim logo se tornou não adequada. Então, foi feito um grid com o uso do plugin [Isotope](https://isotope.metafizzy.co) que permite o arranjo de diversas formas de elementos em uma página, além do uso de bootstrap, jquery, css, html, javascript e d3 (este foi usado apenas para melhor manipulação do csv). Assim, após o esqueleto geral do grid algumas funcionalidades foram adicionadas, como um zoom e uma descrição de cada obra, a possibilidade de filtrar por classificação, adicionar uma listagem com nomes dos títulos para servir como guia geral, botão randomizar a disposição das imagens, botões para mudar o layout do grid e um botão para voltar ao topo da página.


VINI:


RAUL:
O Raul direcionou seus esforços principalmente no desenvolvimento da página CMOA Surface, tendo como maior dificuldade a construção da treemap, que teve um grau de dificuldade não esperado de fazer uma treemap com um csv, pois o mais padrão e o que mais se encontra referências na internet são treemaps de estrituras json. A visualização criada contem basicamente três principais interatividades, um dropdown de seleção de nacionalidade, que aplica um filtro nos dados para mudar a visualização, um tooltip responsivo, que tem o cuidado de sempre estar na tela do usuário e mostra toda a informação da imagem e classificação da mesma, e por fim, um zoom que permite ver todas as imagens, mesmo quando tem poucas imagens de uma determinada categoria e por isso a área delas fica muito pequena, e ao apertar a tecla "q" ela volta o zoom inicial. A treemap também é complemente responsiva, sendo possível acessar em todos os tipos de telas, e ao apertar a tecla "q" a tela é arrastada para mostrar apenas o dropdown e a treemap, sempre mostrando os dois de forma completa. Além da construção completa da treemap e dos textos da página, Raul também fez o programa que realizou o scraping dos links das imagens utilizadas. 

COMENTARIOS DO PROCESSO