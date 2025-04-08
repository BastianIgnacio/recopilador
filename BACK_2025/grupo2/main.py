from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from datetime import datetime
import json
import time
import pickle
import csv
import random

app = FastAPI()

def guardarEstadoApp(objetoEntorno):
    f = open("appDB", "wb")
    pickle.dump(objetoEntorno,f)
    f.close()

class User:
    def __init__(self, ws: WebSocket, client_id: int):
        self.ws = ws
        self.client_id = client_id

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[User] = []

    async def connect(self, websocket: WebSocket, client_id: int):
        await websocket.accept()
        user = User(websocket,client_id)
        self.active_connections.append(user)
    
    def disconnect(self, websocket: WebSocket):
        # Buscar el usuario que tiene ese socket
        for user in self.active_connections:
            if(user.ws == websocket):
                self.active_connections.remove(user)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.ws.send_text(message)
    
    def printUser(self):
        for connection in self.active_connections:
            print(connection.client_id)
    def getJsonUsers(self):
        dataJson = []
        for connection in self.active_connections:
            if(connection.client_id != 1000):
                dataJson.append(connection.client_id)
        return json.dumps(dataJson)
    def existeConeccion(self, client_id: int):
        for user in self.active_connections:
            if user.client_id == client_id:
                return True
        return False
    async def toClients(self, message: str):
        for connection in self.active_connections:
            if connection.client_id != 1000:
                await connection.ws.send_text(message)

    async def toAdminMensaje(self, message: str):
        for connection in self.active_connections:
            if connection.client_id == 1000:
                await connection.ws.send_text(message)

class Encuesta:

    def __init__(self, integrante,grupo,genero,edad,carrera,anoCursandoCarrera,region,comuna,anoEsperaTenerCumplidosRequisitos,
    ingresoFamilia,integrantesDeSuHogar,perteneceAlgunaAsociacion, puedeExternoPostular,esPosibleExpulsar,hanIngresadoNuevosIntegrantes,
    hanExpulsadoAlgunIntegrante,importanciaFormarGrupos):
        
        self.integrante = integrante
        self.grupo = grupo
        self.genero = genero
        self.edad = edad
        self.carrera = carrera
        self.anoCursandoCarrera = anoCursandoCarrera
        self.region = region
        self.comuna = comuna
        self.anoEsperaTenerCumplidosRequisitos = anoEsperaTenerCumplidosRequisitos
        self.ingresoFamilia = ingresoFamilia
        self.integrantesDeSuHogar = integrantesDeSuHogar
        self.perteneceAlgunaAsociacion = perteneceAlgunaAsociacion
        self.puedeExternoPostular = puedeExternoPostular
        self.esPosibleExpulsar = esPosibleExpulsar
        self.hanIngresadoNuevosIntegrantes = hanIngresadoNuevosIntegrantes
        self.hanExpulsadoAlgunIntegrante = hanExpulsadoAlgunIntegrante
        self.importanciaFormarGrupos = importanciaFormarGrupos


class Voto:
    def __init__(self, client_id: int, actividad: int, ronda:int, votaPor: int, tipo: str):
        self.client_id = client_id
        self.actividad = actividad
        self.ronda = ronda
        self.votaPor = votaPor ## EL CLIENT_ID POR QUIEN VOTA
        self.tipo = tipo  # INCLUIR / EXCLUIR

# CLASE PARA SABER CUANTOS VOTOS HA RECIBIDO UN JUGADOR
class JugadorVot:
    def __init__(self, client_id: int):
        self.client_id = client_id
        self.cantidadRecibidos = 0
    
    def votar(self):
        self.cantidadRecibidos = self.cantidadRecibidos + 1
    
    def getCantidadRecibidos(self):
        return self.cantidadRecibidos
       
       
class Jugador:
    def __init__(self, client_id: int, letra: str, club: str):
        self.client_id = client_id
        self.letra = letra
        self.club = club

        # CON ESTAS VARIABLES SABEMOS SI HA SIDO TRASLADADO
        self.trasladadoAzulAAmarillo = False
        self.trasladadoAmarilloAAzul = False

        # CON ESTA VARIABLE SABEMOS SI PUEDE VOTAR PARA INCLUIR
        if club == "AZUL":
            self.puedeVotarIncluir = True
            self.puedeVotarExcluir = True
        else:
            self.puedeVotarIncluir = False
            self.puedeVotarExcluir = False

    def noPuedeVotarIncluir(self):
        self.puedeVotarIncluir = False

    def trasladarAzulAmarillo(self):
        self.trasladadoAzulAAmarillo = True
        self.puedeVotarIncluir = False
        self.puedeVotarExcluir = False

    def trasladarAmarilloAzul(self):
        self.trasladadoAmarilloAAzul = True
        self.puedeVotarIncluir = True
        self.puedeVotarExcluir = True

    def excluir(self):
        self.club = "AMARILLO"
        
    def incluir(self):
        self.club = "AZUL"

    def reiniciar(self):
        self.trasladadoAzulAAmarillo = False
        self.trasladadoAmarilloAAzul = False

    def getClub(self):
        return self.club
    
    def getLetra(self):
        return self.letra
    
    def getInfo(self):
        return "Cliente : " + str(self.client_id) + " | Letra : " + str(self.letra) + " | Club :" + str(self.club)

class Actividad:
    # ESTADOS ACTIVIDAD
    # NO_INICIADA
    # INICIADA
    # ULTIMA_RONDA
    # FINALIZADA

    def __init__(self, tratamiento : str, numero: int, rondas: int, prueba: bool, participantesClubAzul, participantesClubAmarillo, participantes):
        self.estado = "NO_INICIADA"
        self.numero = numero
        self.rondas = rondas
        self.rondaActual = 1
        self.prueba = prueba

        # SABEMOS QUE TRATAMIENTO ESTAMOS TRABAJANDO
        self.tratamiento = tratamiento

        # TODOS LOS PARTICIPANTES
        self.participantes = participantes

        # EL DICCIONARIO DE PARTICIPANTES [1,2,3,4,5]
        self.participantesClubAzul = participantesClubAzul
        # EL DICCIONARIO DE PARTICIPANTES [6,7,8]
        self.participantesClubAmarillo = participantesClubAmarillo
    

        # ----- ACA SE CREAN LOS JUGADORES Y LAS LETRAS POR CADA ACTIVIDAD -----

        if numero == 0:
            #DEPENDE DE LA ACTIVIDAD
            self.letrasClubAzul = ["A","B","C","D","E"]
            self.letrasClubAmarillo = ["F","G","H"]
        
        if numero == 1:
            #DEPENDE DE LA ACTIVIDAD
            self.letrasClubAzul = ["C","D","G","E","B"]
            self.letrasClubAmarillo = ["H","A","F"]
        
        if numero == 2:
            #DEPENDE DE LA ACTIVIDAD
            self.letrasClubAzul = ["F","E","H","G","A"]
            self.letrasClubAmarillo = ["D","C","B"]
    
        if numero == 3:
            #DEPENDE DE LA ACTIVIDAD
            self.letrasClubAzul = ["G","H","B","A","F"]
            self.letrasClubAmarillo = ["E","D","C"]
        
        #JUGADORES
        self.jugadores: List[Jugador] = [] 

        #ACA VAMOS A CREAR TODOS LOS JUGADORES DEL CLUB AZUL
        j = 0
        for participante in self.participantesClubAzul:
            j1 = Jugador(participante,self.letrasClubAzul[j], "AZUL")
            self.jugadores.append(j1)
            j = j+1

        #ACA VAMOS A CREAR TODOS LOS JUGADORES DEL CLUB AMARILLO
        j = 0
        for participante in self.participantesClubAmarillo:
            j1 = Jugador(participante,self.letrasClubAmarillo[j], "AMARILLO")
            self.jugadores.append(j1)
            j = j+1

        # ACA GUARDAREMOS TODAS LAS ASIGNACIONES POR EL MOMENTO
        self.asignaciones: List[AsignacionCreditos] = [] 

        # ADMINISTRADOR DE VOTOS
        self.votosManager = VotosManager(self)
      

    def calcularGanancias(self):
        # DEBEMOS BUSCAR TODAS LAS ASIGNACIONES DE LA RONDA ACTUAL
        asignacionesRondaActual = []
        for asig in self.asignaciones:
            if asig.ronda == self.rondaActual:
                asignacionesRondaActual.append(asig)
        for asig in asignacionesRondaActual:
            asig.calcular()

    # RETORNA TODAS LAS ASIGNACIONES DE UNA RONDA
    def getAsignacionesPorRonda(self, ronda: int):
        listAsignaciones = []
        for a in self.asignaciones:
            if a.ronda == ronda:
                listAsignaciones.append(a)
        return listAsignaciones

    # PARA EXPORTARLAS EN EL ENTORNO
    def getAsignaciones(self):
        listAsignaciones = []
        for a in self.asignaciones:
            listAsignaciones.append(a.get())
        return listAsignaciones
    
    def getDatosJugadores(self):
        ju = []
        for j in self.jugadores:
            jAdd = {"client_id": j.client_id, "letra": j.letra, "club": j.club, "label": "Jugador " + j.letra , "value": j.client_id, "trasladadoAzulAAmarillo": j.trasladadoAzulAAmarillo, "trasladadoAmarilloAAzul": j.trasladadoAmarilloAAzul, "puedeVotarExcluir": j.puedeVotarExcluir, "puedeVotarIncluir": j.puedeVotarIncluir}
            ju.append(jAdd)
        ju.sort(key = self.sortFunction)
        return ju
    
    def getJugador(self, client_id):
        for j in self.jugadores:
            if j.client_id == client_id:
                return j
        return None

    def getJugadores(self):
        return self.jugadores

    def getDatos(self):
        data = {"estado": self.estado,
                "numero" : self.numero,
                "tratamiento": self.tratamiento,
                "rondas" : self.rondas,
                "rondaActual" : self. rondaActual,
                "prueba" : self.prueba,
                "asignaciones": self.getAsignaciones(),
                "tablaVotacion": self.__getTablaClientesVotacion(),
                "tablaAsignacion": self.__getTablaClientesAsignacion(),
                "tablaAdmin": self.__getTablaAdmin(),
                "jugadores": self.getDatosJugadores(),
                "resultadosExcluir" : self.votosManager.getResultadosExcluir(),
                "resultadosIncluir" : self.votosManager.getResultadosIncluir()}
        return data

    def finalizar(self):
        self.estado = "FINALIZADA"

    def siguienteRonda(self):
        self.rondaActual = self.rondaActual + 1
        if self.rondaActual == self.rondas:
            self.estado = "ULTIMA_RONDA"
        # ACA DEBEMOS CALCULAR LOS JUGADORES QUE PASAN A AZUL O A AMARILLO
        self.votosManager.siguienteRonda()

    
    def esUltimaRonda(self):
        return self.estado == "ULTIMA_RONDA"
    
    def iniciar(self):
        self.estado = "INICIADA"
    
    def getEstado(self):
        return self.estado

    def haFinalizado(self):
        return self.estado == "FINALIZADA"

    def addAsignacion(self,client_id: int, fichasClub: int, fichasActividadPrivada: int):
        j = self.getJugador(client_id)

        if j is not None:
            club = j.getClub()
            letra = j.letra
            print(letra)
            print(client_id)
            print(club)
            print(self.rondaActual)
            print(fichasClub)
            print(fichasActividadPrivada)
            asig = AsignacionCreditos(self, client_id, letra, club, self.rondaActual, fichasClub, fichasActividadPrivada)
            self.asignaciones.append(asig)
        
        else:
            print("PROBLEMA JUGADOR NONE")
        club = j.getClub()


    # METODO PARA AÑADIR UN VOTO EXCLUIR
    def votarExcluir(self, client_id: int, votaPor: int):
        self.votosManager.addVotoExcluir(client_id, self, self.rondaActual, votaPor)
    # METODO PARA CALCULAR LA VOTACION EXCLUIR
    def finalizarVotacionExcluir(self):
        self.votosManager.finalizarVotacion("EXCLUIR")
        

    # METODO PARA AÑADIR UN VOTO INCLUIR
    def votarIncluir(self, client_id: int, votaPor: int):
        self.votosManager.addVotoIncluir(client_id, self, self.rondaActual, votaPor)
    # METODO PARA CALCULAR LA VOTACION INCLUIR
    def finalizarVotacionIncluir(self):
        self.votosManager.finalizarVotacion("INCLUIR")

    # METODO PARA BUSCAR LA ASIGNACION QUE LE CORRESPONDE A UN JUGAR Y RONDA
    # EN EL CASO DE NO ENCONTRARLA, RETORNA FALSE
    def __buscarAsignacion(self, client_id: int, ronda:int):
        asignacionBuscar = None
        for asig in self.asignaciones:
            if asig.client_id == client_id and asig.ronda == ronda:
                asignacionBuscar = asig
        return asignacionBuscar

    def __calcularGananciasAcumuladas(self, client_id: int):
        total = 0
        for asig in self.asignaciones:
            if asig.client_id == client_id:
                total = total + asig.resultadoPesosExperimentales
        return total

    # METODO QUE RETORNA CUANTO GANO EL JUGADOR EN LA ACTIVIDAD EN PESOS CHILENOS 
    def calcularGananciasPorJugador(self, client_id: int):
        total = 0
        for asig in self.asignaciones:
            if asig.client_id == client_id:
                total = total + asig.resultadoPesosExperimentales
        return total * 3


    #METODO PARA GENERAR LA TABLA A MOSTRAR EN LA WEB, SE MUESTRA EN VOTACION
    #VAMOS A BUSCAR TODAS LAS ASIGNACIONES Y ENTREGAR LAS QUE CORRESPONDEN A SOLO UN JUGADOR
    def __getTablaPorJugador(self, client_id : int):
        data = {}
        data['jugador'] = client_id
        data['letra'] = self.getJugador(client_id).getLetra() 
        data['label'] = ["JUG. " + self.getJugador(client_id).getLetra(), "PLOMO_JUGADOR"]
        data['clientId'] = [str(client_id), "PLOMO_CLIENT_ID"]
        for r in range(1, self.rondas + 1):
            asig = self.__buscarAsignacion(client_id, r)

            if asig is not None:
                data['ronda_'+ str(r)] = [asig.fichasClub, asig.club]
            else:
                data['ronda_'+ str(r)] = ["-", "PLOMO"]

        asig = self.__buscarAsignacion(client_id, self.rondaActual)
        data['gananciaRondaActual'] = ["-", "PLOMO_EXTRA"]
        if asig is not None:
            data['gananciaRondaActual'] = [ "E$ " + str(asig.resultadoPesosExperimentales), "PLOMO_EXTRA"]

        #ACA DEBEMOS CALCULAR LAS GANACIAS ACUMULADAS
        data['gananciasAcumuladas'] = ["E$ " + str(self.__calcularGananciasAcumuladas(client_id)), "PLOMO_EXTRA"]
        data['color'] = self.getJugador(client_id).getClub()
        data['rowTotal'] = False
        return data

    #METODO PARA GENERAR LA TABLA A MOSTRAR EN LA WEB EN ASIGNACION DE FICHAS, ENVIA LA RONDA ACTUAL
    #VAMOS A BUSCAR TODAS LAS ASIGNACIONES Y ENTREGAR LAS QUE CORRESPONDEN A SOLO UN JUGADOR
    def __getTablaPorJugadorAsignacion(self, client_id : int):
        data = {}
        data['jugador'] = client_id
        data['letra'] = self.getJugador(client_id).getLetra() 
        data['label'] = ["JUG. " + self.getJugador(client_id).getLetra(), "PLOMO_JUGADOR"]
        for r in range(1, self.rondas + 1):
            asig = self.__buscarAsignacion(client_id, r)

            if asig is not None:
                if r == self.rondaActual:
                    data['ronda_'+ str(r)] = ["-", asig.club]
                else:
                    data['ronda_'+ str(r)] = [asig.fichasClub, asig.club]
            else:
                data['ronda_'+ str(r)] = ["-", "PLOMO"]

        if self.rondaActual == 1:
            data['gananciaUltimaRonda'] = ["E$ -", "PLOMO_EXTRA"]

        else:
            #ACA DEBEMOS CALCULARLO
            # ACA BUSCAMOS LA ULTIMO RONDA Y MOSTRAMOS LA GANANCIA 
            asig = self.__buscarAsignacion(client_id, self.rondaActual - 1)
            data['gananciaUltimaRonda'] = ["E$ "+ str(asig.resultadoPesosExperimentales), "PLOMO_EXTRA"]

        #ACA DEBEMOS CALCULAR LAS GANACIAS ACUMULADAS
        data['gananciasAcumuladas'] = ["E$ " + str(self.__calcularGananciasAcumuladas(client_id)), "PLOMO_EXTRA"]
        data['color'] = self.getJugador(client_id).getClub()
        data['rowTotal'] = False
        return data

    # VAMOS A CALCULAR EL RETIRO TOTAL DE LOS AZULES POR CADA RONDA
    def __getTablaRetirosTotalesAzules(self):
        data = {}
        data['jugador'] = 100
        data['letra'] = "z" 
        data['label'] = "RETIROS TOTALES"
        for r in range(1, self.rondas + 1):
            totalRetiros = 0
            for asig in self.asignaciones:
                if asig.club == "AZUL" and asig.ronda == r:
                    totalRetiros = totalRetiros + asig.fichasClub

            if r != self.rondaActual:
                data['ronda_'+ str(r)] = "-"
            else:
                data['ronda_'+ str(r)] = totalRetiros

        
        data['gananciaUltimaRonda'] = "-"
        data['gananciasAcumuladas'] = "-"
        data['color'] = "AZUL"
        data['rowTotal'] = True
        return data
    # VAMOS A CALCULAR EL RETIRO TOTAL DE LOS AZULES POR CADA RONDA, EXCEPTO LA RONDA ACTUAL
    def __getTablaRetirosTotalesAzulesAsignacion(self):
        data = {}
        data['jugador'] = 100
        data['letra'] = "z" 
        data['label'] = "RETIROS TOTALES"
        for r in range(1, self.rondas + 1):
            totalRetiros = 0
            for asig in self.asignaciones:
                if asig.club == "AZUL" and asig.ronda == r:
                    totalRetiros = totalRetiros + asig.fichasClub
            if r == self.rondaActual:
                data['ronda_'+ str(r)] = "-"
            else:
                if r > self.rondaActual:
                    data['ronda_'+ str(r)] = "-"
                else:
                    data['ronda_'+ str(r)] = "-"
        
        data['gananciaUltimaRonda'] = "-"
        data['gananciasAcumuladas'] = "-"
        data['color'] = "AZUL"
        data['rowTotal'] = True
        return data
    
    # VAMOS A CALCULAR EL RETIRO TOTAL DE LOS AZULES POR CADA RONDA
    def __getTablaRetirosTotalesAmarillos(self):
        data = {}
        data['jugador'] = 99
        data['letra'] = "z" 
        data['label'] = "RETIROS TOTALES"
        for r in range(1, self.rondas + 1):
            totalRetiros = 0
            for asig in self.asignaciones:
                if asig.club == "AMARILLO" and asig.ronda == r:
                    totalRetiros = totalRetiros + asig.fichasClub
                
            if r != self.rondaActual:
                data['ronda_'+ str(r)] = "-"
            else:
                data['ronda_'+ str(r)] = totalRetiros
        
        data['gananciaUltimaRonda'] = "-"
        data['gananciasAcumuladas'] = "-"
        data['color'] = "AMARILLO"
        data['rowTotal'] = True
        return data

    # VAMOS A CALCULAR EL RETIRO TOTAL DE LOS AZULES POR CADA RONDA
    def __getTablaRetirosTotalesAmarillosEnAsignacion(self):
        data = {}
        data['jugador'] = 99
        data['letra'] = "z" 
        data['label'] = "RETIROS TOTALES"
        for r in range(1, self.rondas + 1):
            totalRetiros = 0
            for asig in self.asignaciones:
                if asig.club == "AMARILLO" and asig.ronda == r:
                    totalRetiros = totalRetiros + asig.fichasClub
                
            if r == self.rondaActual:
                data['ronda_'+ str(r)] = "-"
            else:
                if r > self.rondaActual:
                    data['ronda_'+ str(r)] = "-"
                else:
                    data['ronda_'+ str(r)] = "-"
        
        data['gananciaUltimaRonda'] = "-"
        data['gananciasAcumuladas'] = "-"
        data['color'] = "AMARILLO"
        data['rowTotal'] = True
        return data

    def sortFunction(self, e):
        return e['letra']

    def __getTablaClientesVotacion(self):
        dataTabla = []
        for participante in self.participantes:
            dataJugador = self.__getTablaPorJugador(participante)
            dataTabla.append(dataJugador)
        dataTabla.sort(key = self.sortFunction)
        dataTabla.append(self.__getTablaRetirosTotalesAzules())
        dataTabla.append(self.__getTablaRetirosTotalesAmarillos())

        return dataTabla

    # ACA CREAMOS LA DATA PARA LA TABLA QUE SE MUESTRA EN ASIGNAR CREDITOS
    def __getTablaClientesAsignacion(self):
        dataTabla = []
        for participante in self.participantes:
            dataJugador = self.__getTablaPorJugadorAsignacion(participante)
            dataTabla.append(dataJugador)
        dataTabla.sort(key = self.sortFunction)
        dataTabla.append(self.__getTablaRetirosTotalesAzulesAsignacion())
        dataTabla.append(self.__getTablaRetirosTotalesAmarillosEnAsignacion())

        return dataTabla

    def __getTablaAdmin(self):
        dataTabla = []
        for participante in self.participantes:
            dataJugador = self.__getTablaPorJugador(participante)
            dataTabla.append(dataJugador)
        return dataTabla

    # METODO PARA GENERAR EL RESUMEN DE GANACIAS DE UNA ACTIVIDAD
    def getResumenActividad(self):
        arrayResumen = []
        for j in self.jugadores:
            totalGanancia = 0
            client_id_jugador = j.client_id
            for asig in self.asignaciones:
                if asig.client_id == client_id_jugador:
                    totalGanancia = totalGanancia + asig.resultadoPesosExperimentales
            # validamos que la ganancia sea igual a mayor a cero
            if totalGanancia < 0:
                totalGanancia = 0
            factorConversion = "3 Pesos Chilenos por cada E$"
            strPesosExperimentales = "E$ " + str(totalGanancia)
            pesosChilenos = 3 * totalGanancia

            strPesosChilenos = "$ "+str(pesosChilenos)
            resum = {"actividad" : self.numero ,"client_id": client_id_jugador ,"pesosExperimentales": strPesosExperimentales, "factorConversion": factorConversion, "pesosChilenos": strPesosChilenos, "intPesosChilenos": pesosChilenos }
            arrayResumen.append(resum)
        return arrayResumen


class AsignacionCreditos:
    def __init__(self, actividad: Actividad, client_id: int, letra:str, club: str, ronda:int, fichasClub: int, fichasActividadPrivada: int):
        self.client_id = client_id
        self.letra = letra
        self.club = club
        self.ronda = ronda
        self.fichasClub = fichasClub
        self.fichasActividadPrivada = fichasActividadPrivada


        self.actividad = actividad
        self.resultadoPesosExperimentales = 0

        self.base = 50

        #cantidad jugadores 
        self.cantidadJugadoresAzul = 0
        self.cantidadJugadoresAmarillo = 0

        # Cantidad Fichas Clubes
        self.cantidadFichasQueHayEnAzul = 40
        self.cantidadFichasQueHayEnAmarillo = 40

        # Cantidad Fichas retiradas
        self.cantidadFichasRetiradasClubAzul = 0
        self.cantidadFichasRetiradasClubAmarillo = 0

        # Cantidad Fichas que quedan 
        self.cantidadFichasQuedanAzul = 0
        self.cantidadFichasQuedanAmarillo = 0

    def calcular(self):
        tipoTratamiento = self.actividad.tratamiento

        #TOMAMOS TODAS LAS ASIGNACIONES DE LA RONDA EN DICHA ACTIVIDAD
        asignacionesList = self.actividad.getAsignacionesPorRonda(self.ronda)

        #CALCULAMOS CUANTAS FICHAS QUEDAN EN EL CLUB AZUL
        CJ_AZUL = 0
        fichasClubAzul = 0
        for asig in asignacionesList:
            if asig.club == "AZUL":
                fichasClubAzul = fichasClubAzul + asig.fichasClub
                CJ_AZUL = CJ_AZUL + 1
            
        self.cantidadJugadoresAzul = CJ_AZUL
        self.cantidadFichasRetiradasClubAzul = fichasClubAzul

        quedanAzul = self.cantidadFichasQueHayEnAzul - fichasClubAzul
        self.cantidadFichasQuedanAzul = quedanAzul


        #CALCULAMOS CUANTAS FICHAS QUEDAN EN EL CLUB AZUL
        CJ_AMARILLO = 0
        fichasClubAmarillo = 0
        for asig in asignacionesList:
            if asig.club == "AMARILLO":
                fichasClubAmarillo = fichasClubAmarillo + asig.fichasClub
                CJ_AMARILLO = CJ_AMARILLO + 1

        self.cantidadJugadoresAmarillo = CJ_AMARILLO
        self.cantidadFichasRetiradasClubAmarillo = fichasClubAmarillo

        quedanAmarillo = self.cantidadFichasQueHayEnAmarillo - fichasClubAmarillo
        self.cantidadFichasQuedanAmarillo = quedanAmarillo

        match tipoTratamiento:
            case "T1":
                # BASELINE
                if self.club == "AZUL":
                    pesosExp = self.fichasActividadPrivada * 4 + self.fichasClub * 16 + quedanAzul * 8
                    self.resultadoPesosExperimentales = pesosExp + self.base
                    
                if self.club == "AMARILLO":
                    pesosExp = self.fichasActividadPrivada * 1 + self.fichasClub * 4 + quedanAmarillo * 2
                    self.resultadoPesosExperimentales = pesosExp + self.base

            case "T2":
                # EXCLUSION COST
                if self.club == "AZUL":
                    costoExclusion = CJ_AMARILLO * 32
                    pesosExp = self.fichasActividadPrivada * 4 + self.fichasClub * 16 + quedanAzul * 8 - costoExclusion
                    self.resultadoPesosExperimentales = pesosExp + self.base
                    
                if self.club == "AMARILLO":
                    pesosExp = self.fichasActividadPrivada * 1 + self.fichasClub * 4 + quedanAmarillo * 2
                    self.resultadoPesosExperimentales = pesosExp + self.base
            case "T3":
                # EXCLUSION COST + CONGESTION COST
                if self.club == "AZUL":
                    costoExclusion = CJ_AMARILLO * 32
                    costoCongestion = CJ_AZUL * 32
                    pesosExp = self.fichasActividadPrivada * 4 + self.fichasClub * 16 + quedanAzul * 8 - costoExclusion - costoCongestion
                    self.resultadoPesosExperimentales = pesosExp + self.base
                    
                if self.club == "AMARILLO":
                    pesosExp = self.fichasActividadPrivada * 1 + self.fichasClub * 4 + quedanAmarillo * 2
                    self.resultadoPesosExperimentales = pesosExp + self.base
            case "T4":
                # CONGESTION COST
                if self.club == "AZUL":
                    costoCongestion = CJ_AZUL * 32
                    pesosExp = self.fichasActividadPrivada * 4 + self.fichasClub * 16 + quedanAzul * 8 - costoCongestion
                    self.resultadoPesosExperimentales = pesosExp  + self.base
                    
                if self.club == "AMARILLO":
                    pesosExp = self.fichasActividadPrivada * 1 + self.fichasClub * 4 + quedanAmarillo * 2
                    self.resultadoPesosExperimentales = pesosExp + self.base
            case _:
                print("ERROR NO SE ENCONTRO TRATAMIENTO")

    def get(self):
        return {"jugador" : self.client_id, "club": self.club, "ronda" : self.ronda, "fichasClub": self.fichasClub, "fichasActividadPrivada": self.fichasActividadPrivada, "resultadoPesosExperimentales" : self.resultadoPesosExperimentales,
        "cantidadFichasQueHayEnAzul" : self.cantidadFichasQueHayEnAzul, 
        "cantidadFichasQueHayEnAmarillo" : self.cantidadFichasQueHayEnAmarillo,
        "cantidadFichasRetiradasClubAzul": self.cantidadFichasRetiradasClubAzul,
        "cantidadFichasRetiradasClubAmarillo": self.cantidadFichasRetiradasClubAmarillo,
        "cantidadFichasQuedanAzul" : self.cantidadFichasQuedanAzul,
        "cantidadFichasQuedanAmarillo" : self.cantidadFichasQuedanAmarillo,
        "cantidadJugadoresAzul" : self.cantidadJugadoresAzul,
        "cantidadJugadoresAmarillo" : self.cantidadJugadoresAmarillo }

class VotosManager:
    def __init__(self, actividad: Actividad):

        # referenciamos la actividad que corresponde
        self.actividad = actividad

        #VOTACIONES
        self.votosExcluir : List[Voto] = []
        self.votosIncluir : List[Voto] = []

        self.votosDinamicos : List[Voto] = []


        #RESULTADOS / NOTIFICACIONES
        self.resultadosExcluir = []
        self.resultadosIncluir = []

        #JUGADORES POR EXCLUIR / INCLUIR AL FINALIZAR
        self.jugadoresPorExcluir : List[Jugador] = []
        self.jugadoresPorIncluir : List[Jugador] = []


    def __reiniciarVotacion(self):
        self.votosDinamicos.clear()

    
    def siguienteRonda(self):
        for j in self.jugadoresPorExcluir:
            j.excluir()
        
        for j in self.jugadoresPorIncluir:
            j.incluir()

        # reiniciamos los votos dinamicos
        self.__reiniciarVotacion()

        self.jugadoresPorExcluir.clear()
        self.jugadoresPorIncluir.clear()

        # AHORA DEBEMOS REINICIAR LOS JUGADORES 
        jugadores = self.actividad.getJugadores()
        for j in jugadores:
            j.reiniciar()

    def getResultadosExcluir(self):
        value = {
        "excluidos": self.resultadosExcluir
        }
        return value

    def getResultadosIncluir(self):
        value = {
        "incluidos": self.resultadosIncluir
        }
        return value

    def addVotoExcluir(self, client_id: int, actividad: int, ronda:int, votaPor: int):
        voto = Voto(client_id, actividad, ronda, votaPor, "EXCLUIR")
        self.votosDinamicos.append(voto)
        self.votosExcluir.append(voto)

    def addVotoIncluir(self, client_id: int, actividad: int, ronda:int, votaPor: int):
        voto = Voto(client_id, actividad, ronda, votaPor, "INCLUIR")
        self.votosDinamicos.append(voto)
        self.votosIncluir.append(voto)

    def finalizarVotacion(self, tipo:str):
        # TENEMOS QUE SABER LOS JUGADORES QUE SON AZULES y AMARILLOS
        cantidadAzules = 0
        cantidadAmarillos = 0
        jugadores = self.actividad.getJugadores()

        votantes : List[JugadorVot] = []
        for j in jugadores:
            votantes.append(JugadorVot(j.client_id))
            if j.club == "AZUL":
                if not j.trasladadoAzulAAmarillo:
                    cantidadAzules = cantidadAzules + 1
            if j.club == "AMARILLO":
                cantidadAmarillos = cantidadAmarillos + 1

        # ERROR CUANDO cantidadAzules se hace cero 


        # TENEMOS QUE SABER LOS VOTOS MINIMOS PARA SER EXCLUIDO O INCLUIDO
        minAzules = cantidadAzules * 0.5
        minAmarillos = cantidadAmarillos * 0.5

        # VAMOS A CALCULAR LA VOTACION DE EXCLUIR
        if tipo == "EXCLUIR":
            if minAzules == 0:
                minAzules = 1
            self.resultadosExcluir = []
            for voto in self.votosDinamicos:
                # POR QUIEN SE VOTO
                votaPor = voto.votaPor
                for jv in votantes:
                    if jv.client_id == votaPor:
                        jv.votar()
            for jv in votantes:
                if jv.cantidadRecibidos >= minAzules:
                    #SE DEBE EXCLUIR PARA LA PROX RONDA
                    #NO PUEDE VOTAR PARA INCLUIR 
                    self.resultadosExcluir.append(jv.client_id)
                    client_id_movido = jv.client_id

                    # DEBEMOS OBTENER EL JUGADOR, AÑADIRLO PARA EXCLUIRLO Y NO DEJAR QUE PUEDA VOTAR
                    jugador_movido = self.actividad.getJugador(client_id_movido)
                    jugador_movido.noPuedeVotarIncluir()
                    jugador_movido.trasladarAzulAmarillo()
                    self.jugadoresPorExcluir.append(jugador_movido)

        if tipo == "INCLUIR":
            if minAzules == 0:
                minAzules = 1
            self.resultadosIncluir = []
            for voto in self.votosDinamicos:
                # POR QUIEN SE VOTO
                votaPor = voto.votaPor
                for jv in votantes:
                    if jv.client_id == votaPor:
                        jv.votar()
            for jv in votantes:
                if jv.cantidadRecibidos >= minAzules:
                    #SE DEBE EXCLUIR PARA LA PROX RONDA
                    #NO PUEDE VOTAR PARA INCLUIR 
                    self.resultadosIncluir.append(jv.client_id)
                    client_id_movido = jv.client_id
                    jugador_movido = self.actividad.getJugador(client_id_movido)
                    jugador_movido.trasladarAmarilloAzul()
                    self.jugadoresPorIncluir.append(jugador_movido)
        
        self.__reiniciarVotacion()

class Entorno:
    # MOSTRAR_BIENVENIDO
    # MOSTRAR_INICIAR_ACTIVIDAD
    # MOSTRAR_ASIGNAR_CREDITOS
    # MOSTRAR_VOTAR_EXCLUIR
    # MOSTRAR_VOTAR_INCLUIR
    # MOSTRAR_EQUIPOS_ACTUALES
    # MOSTRAR_RESUMEN_ACTIVIDAD

    def __init__(self):
        self.participantesClubAzul = [1,2,3,4,5]
        self.participantesClubAmarillo = [6,7,8]

        self.dictParticipantes = [1,2,3,4,5,6,7,8]
        self.grupo = 1
        self.sesionNombre = ""
        self.nombreSesion = ""
    
        self.estado = "INICIO"
        self.estadoAdmin = ""
        self.estadoClientes = ""

        self.actividades: List[Actividad] = [] 
        self.actividadActual = 0

        #VARIABLE PARA SABER SI EL JUEGO SE HA CREADO O NO
        self.juegoCreado = False


        # ARRAY DINAMICO DE CONFIRMACION
        self.arrayDinamicoConfirmacion = []

        #ENCUESTAS
        self.encuestas: List[Encuesta] = []

    
    # DATOS CSV
    def exportarDatos(self):
        #NOMBRE DEL ARCHIVO
        nombreSesion = self.nombreSesion
        grupo = self.grupo
        nombreArchivoExportar = "exportacion_" + nombreSesion + "_grupo_" + str(grupo) + ".csv"

        #ACTIVIDADES DE LA SESION
        actividades = self.actividades

        # COLUMNAS DEL ARCHIVO
        headers = ['sessionId','groupNumber','activityNumber','activityTest','internId', 'playerLetter' ,'round', 'club','tokensTakenClub','tokensPrivateActivity', 
        'cantidadJugadoresAzul' , 'cantidadJugadoresAmarillo', 'cantidadFichasRetiradasClubAzul', 'cantidadFichasRetiradasClubAmarillo', 'cantidadFichasRemanentesAzul' ,
        'cantidadFichasRemanentesAmarillo', 'base','experimentalPesosEarnings','treatment',
        "VE_1","VE_2","VE_3","VE_4","VE_5","VE_6","VE_7","VE_8","VRE","VI_1","VI_2","VI_3","VI_4","VI_5","VI_6","VI_7","VI_8","VRI"]
        asigArray = []

        for act in actividades:
            asignaciones = act.asignaciones
            tratamiento = act.tratamiento
            numero = act.numero

            for asigAux in asignaciones:

                # DEBEMOS BUSCAR EL VOTO DE DICHA ASINACION
                client_id = asigAux.client_id
                letra = asigAux.letra
                ronda = asigAux.ronda


                # BUSCAMOS EL VOTOS MANAGER DE LA ACTIVIDAD
                vm = act.votosManager

                # BUSCAMOS LA LISTA DE VOTACION EXCLUIR
                votosExcluir = vm.votosExcluir

                # BUSCAMOS EL VOTO DE LA RONDA CORRESPONDIENTE
                votoExcluirAux = None
                for ve in votosExcluir:
                    if ve.client_id == client_id and ronda == ve.ronda:
                        votoExcluirAux = ve


                #CREAMOS EL ARRAY VOTOS EXCLUIR
                #vota_1, vota_2, vota_3, vota_4, vota_5, vota_6, vota_7,vota_8, VER
                arrayVE = ["0","0","0","0","0","0","0","0","0"]
                # NO PUEDE VOTAR POR EL MISMO
                arrayVE[client_id - 1] = "."

                ## IMPRIMIREMOS LOS VOTOS INCLUIR Y EXCLUIR
                if votoExcluirAux is not None:
                    if votoExcluirAux.votaPor != "no":
                        client_id_voto = votoExcluirAux.votaPor
                        arrayVE[client_id_voto - 1] = "1"
                    print(arrayVE)
                
                # DEBEMOS CALCULAR LOS VOTOS RECIBIDOS 
                votosRecibidos = 0
                for ve in votosExcluir:
                    if ve.ronda == ronda and ve.votaPor == client_id:
                        votosRecibidos = votosRecibidos + 1
                arrayVE[8] = votosRecibidos

                # ----------------------------------------------------------

                #BUSCAMOS LA LISTA DE VOTACION INCLUIR
                votosIncluir = vm.votosIncluir

                #BUSCAMOS EL VOTO DE INCLUIR
                votoIncluirAux = None
                for vi in votosIncluir:
                    if vi.client_id == client_id and ronda == vi.ronda:
                        votoIncluirAux = vi

                #CREAMOS EL ARRAY VOTOS INCLUIR
                #vota_1, vota_2, vota_3, vota_4, vota_5, vota_6, vota_7,vota_8, VRI
                # NO PUEDE VOTAR POR EL MISMO
                arrayVI = ["0","0","0","0","0","0","0","0","0"]
                arrayVI[client_id - 1] = "."

                if votoIncluirAux is not None:
                    if votoIncluirAux.votaPor != "no":
                        client_id_voto = votoIncluirAux.votaPor
                        arrayVI[client_id_voto - 1] = "1"

                # DEBEMOS CALCULAR LOS VOTOS RECIBIDOS 
                votosRecibidos = 0
                for vi in votosIncluir:
                    if vi.ronda == ronda and vi.votaPor == client_id:
                        votosRecibidos = votosRecibidos + 1
                arrayVI[8] = votosRecibidos

                # ----------------------------------------------------------
                    
                #CREAMOS EL ARRAY DE LA ASIGNACION
                arrayToAsig = [nombreSesion, grupo,numero, str(act.prueba), asigAux.client_id, letra,asigAux.ronda ,
                asigAux.club, asigAux.fichasClub,
                asigAux.fichasActividadPrivada, asigAux.cantidadJugadoresAzul, asigAux.cantidadJugadoresAmarillo,
                asigAux.cantidadFichasRetiradasClubAzul,asigAux.cantidadFichasRetiradasClubAmarillo,
                asigAux.cantidadFichasQuedanAzul,asigAux.cantidadFichasQuedanAmarillo,
                asigAux.base, asigAux.resultadoPesosExperimentales, tratamiento]
                for i in arrayVE:
                    arrayToAsig.append(i)
                for i in arrayVI:
                    arrayToAsig.append(i)
                asigArray.append(arrayToAsig)
        
        with open(nombreArchivoExportar, mode='w', newline='') as file:

            writer = csv.writer(file)
            writer.writerow( headers) # Creamos las columnas

            for asigAux in asigArray:
                writer.writerow(asigAux)
            
        file.close()      

    # ENCUESTA
    def addEncuesta(self, data):
        integrante = data["integrante"]
        grupo = self.grupo
        genero = data['genero']
        edad = data['edad']
        carrera = data['carrera']
        anoCursandoCarrera = data['anoCursandoCarrera']
        region = data['region']
        comuna = data['comuna']
        anoEsperaTenerCumplidosRequisitos = data['anoEsperaTenerCumplidosRequisitos']
        ingresoFamilia = data['ingresoFamilia']
        integrantesDeSuHogar = data['integrantesDeSuHogar']
        perteneceAlgunaAsociacion = data['perteneceAlgunaAsociacion']
        puedeExternoPostular = data['puedeExternoPostular']
        esPosibleExpulsar = data['esPosibleExpulsar']
        hanIngresadoNuevosIntegrantes = data['hanIngresadoNuevosIntegrantes']
        hanExpulsadoAlgunIntegrante = data['hanExpulsadoAlgunIntegrante']
        importanciaFormarGrupos = data['importanciaFormarGrupos']


        encuesta = Encuesta(integrante,grupo,genero,edad,carrera,anoCursandoCarrera,region,comuna,anoEsperaTenerCumplidosRequisitos,
        ingresoFamilia,integrantesDeSuHogar,perteneceAlgunaAsociacion, puedeExternoPostular,esPosibleExpulsar,hanIngresadoNuevosIntegrantes,
        hanExpulsadoAlgunIntegrante,importanciaFormarGrupos)
        print("añadiendo encuesta")
        self.encuestas.append(encuesta)

    # DATOS CSV
    def exportarEncuestas(self):
        #NOMBRE DEL ARCHIVO
        nombreSesion = self.nombreSesion
        grupo = self.grupo
        nombreArchivoExportar = "exportacion_" + nombreSesion + "_grupo_" + str(grupo) + "_encuestas.csv"

        # COLUMNAS DEL ARCHIVO
        headers = ['integrante','grupo','genero','edad','carrera','anoCursandoCarrera','region','comuna','anoEsperaTenerCumplidosRequisitos',
        'ingresoFamilia','integrantesDeSuHogar','perteneceAlgunaAsociacion', 'puedeExternoPostular','esPosibleExpulsar','hanIngresadoNuevosIntegrantes',
        'hanExpulsadoAlgunIntegrante','importanciaFormarGrupos']
        asigArray = []

        # REVISAMOS TODAS LAS ENCUESTAS
        for enc in self.encuestas:
            arrayAux = [enc.integrante, enc.grupo, enc.genero, enc.edad, enc.carrera, enc.anoCursandoCarrera, enc.region, enc.comuna, enc.anoEsperaTenerCumplidosRequisitos,
            enc.ingresoFamilia, enc.integrantesDeSuHogar, enc.perteneceAlgunaAsociacion, enc.puedeExternoPostular, enc.esPosibleExpulsar, enc.hanIngresadoNuevosIntegrantes,
            enc.hanExpulsadoAlgunIntegrante, enc.importanciaFormarGrupos]
            asigArray.append(arrayAux)
            
        with open(nombreArchivoExportar, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow( headers) # Creamos las columnas
            for asigAux in asigArray:
                writer.writerow(asigAux)
        file.close()     

    def exportarPagos(self):
        #NOMBRE DEL ARCHIVO
        nombreSesion = self.nombreSesion
        grupo = self.grupo
        nombreArchivoExportar = "exportacion_" + nombreSesion + "_grupo_" + str(grupo) + "_pagos.csv"


        #ACTIVIDADES DE LA SESION
        actividades = self.actividades

        # COLUMNAS DEL ARCHIVO
        headers = ['integrante','BASE','ACTIVIDAD_1','ACTIVIDAD_2','ACTIVIDAD_3', 'TOTAL']
        asigArray = []


        for j in self.dictParticipantes:
            
            # j = del 1 al 8 client_id
            arrayAux = []
            arrayAux.append(j)
            arrayAux.append(4500)

            arrayGanancias = [0,0,0,0]
            totalSesion = 4500
            for act in actividades:
                print("Jugador : " + str(j) + "  actividad: " + str(act.numero))
                numeroActividad = act.numero
                total = act.calcularGananciasPorJugador(j)
                if numeroActividad != 0:
                    totalSesion = totalSesion + total
                    arrayGanancias[numeroActividad - 1] = total

            arrayGanancias[3] = totalSesion
            for ag in arrayGanancias:
                arrayAux.append(ag)
            
            asigArray.append(arrayAux)
                
        with open(nombreArchivoExportar, mode='w', newline='') as file:

            writer = csv.writer(file)
            writer.writerow( headers) # Creamos las columnas

            for asigAux in asigArray:
                writer.writerow(asigAux)
            
        file.close()      
 

    
    #CSV EXPORTACIOONES
    def iniciarEncuesta(self):
        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_ENCUESTA"
        self.setEstadoAdmin = "ESPERANDO_ENCUESTA"
        self.estadoClientes = "CONFIRMANDO_ENCUESTA"

        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()
    
    def confirmarEntregaEncuesta(self, client_id: int):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)
    

    def crearJuego(self, nombreSesion, tratamiento, actividades, rondas):
        self.estado = "MOSTRAR_BIENVENIDO"
        self.juegoCreado = True
        self.nombreSesion = nombreSesion

        #CREAMOS LA ACTIVIDAD DE PRUEBA
        self.actividades.append(Actividad(tratamiento,0,3,True, self.participantesClubAzul, self.participantesClubAmarillo, self.dictParticipantes))

        #CREAMOS LAS ACTIVIDADES
        for i in range(1, actividades + 1):
            self.actividades.append(Actividad(tratamiento,i,rondas,False, self.participantesClubAzul, self.participantesClubAmarillo, self.dictParticipantes))

    def calcularGanancias(self):
        act = self.getActividad(self.actividadActual)
        act.calcularGanancias()
    
    

    def setEstadoAdmin(self, estadoAdmin):
        self.estadoAdmin = estadoAdmin
    
    def setEstadoClientes(self, estadoClientes):
        self.estadoClientes = estadoClientes
    
    def getVistasBloqueadas(self):
        vistas = []
        for client in self.dictParticipantes:
            if client in self.arrayDinamicoConfirmacion:
                c = {"client_id": client, "bloqueado" : True}
            else:
                c = {"client_id": client, "bloqueado" : False}
            vistas.append(c)
        return vistas
    
    # ACTIVIDADES
    def getActividad(self, numero):
        for act in self.actividades:
            if act.numero == numero:
                return act
        return None

    def finalizarActividad(self):
        act = self.getActividad(self.actividadActual)
        act.finalizar()


    def getDatosActividad(self):
        act = self.getActividad(self.actividadActual)
        if act is not None:
            return act.getDatos()
        return None

    def siguienteActividad(self):
        self.actividadActual = self.actividadActual + 1
        act = self.getActividad(self.actividadActual)
        act.iniciar()

        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_INICIAR_ACTIVIDAD"
        self.setEstadoAdmin = "ESPERANDO_INICIAR _ACTIVIDAD"
        self.estadoClientes = "CONFIRMANDO_INICIO_ACTIVIDAD"


    # RONDAS
    def siguienteRonda(self):
        act = self.getActividad(self.actividadActual)
        act.siguienteRonda()

    def esUltimaRonda(self):
        act = self.getActividad(self.actividadActual)
        return act.esUltimaRonda()

    # RESUMEN FINALIZAR ACTIVIDADES
    def get_resumen_actividades(self):
        arrayResumen = []
        for act in self.actividades:
            if act.numero <= self.actividadActual:
                arrayResumenAct = act.getResumenActividad()
                for arc in arrayResumenAct:
                    arrayResumen.append(arc)
        return arrayResumen

    # ENTORNO
    def getDatosEntorno(self):
        data = {"estado" : self.estado, 
                "estadoAdmin": self.estadoAdmin,
                "estadoClientes" : self.estadoClientes,
                "juegoCreado": self.juegoCreado,
                "sesion": self.nombreSesion,
                "vistas": self.getVistasBloqueadas(),
                "actividad" : self.getDatosActividad(),
                "resumen_actividades": self.get_resumen_actividades(),
                }
        return data
    
    # CONFIRMACION DE BIENVENIDO
    def confirmarBienvenido(self, client_id: int):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)
    
    def hanConfirmadoBienvenido_todos(self):
        for participante in self.dictParticipantes:
            if not participante in self.arrayDinamicoConfirmacion:
                return False
        return True

    def __reiniciarArrayDinamicoConfirmacion(self):
        self.arrayDinamicoConfirmacion = []



    # COMENZAR ACTIVIDAD PRUEBA
    def iniciarActividadPrueba(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_INICIAR_ACTIVIDAD"
        self.setEstadoAdmin = "ESPERANDO_INICIAR _ACTIVIDAD_PRUEBA"
        self.estadoClientes = "CONFIRMANDO_INICIO_ACTIVIDAD_PRUEBA"

        #DEBEMOS BUSCAR E INICIAR LA ACTIVIDAD
        act = self.getActividad(self.actividadActual)
        act.iniciar()

    #ACTIVIDADES
    def confirmarComienzoActividad(self, client_id: int):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)

    #ARRAY DINAMICO CONFIRMACION
    def hanConfirmadoTodos(self):
        for participante in self.dictParticipantes:
            if not participante in self.arrayDinamicoConfirmacion:
                return False
        return True

    #ASIGNACION DE CREDITOS
    def iniciarAsignarCreditos(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_ASIGNAR_CREDITOS"
        self.setEstadoAdmin = "ESPERANDO_ASIGNACION_CREDITOS"
        self.estadoClientes = "CONFIRMANDO_ASIGNACION_CREDITOS"

    def asignarCreditos(self,client_id: int, fichasClub: int, fichasActividadPrivada: int):
        act = self.getActividad(self.actividadActual)
        act.addAsignacion(client_id, fichasClub, fichasActividadPrivada)

    def confirmarAsignacionCreditos(self, client_id: int):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)

    # DETALLE ASIGNACION CREDITOS
    def mostrarDetalleAsignacion(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_DETALLE_ASIGNACION_CREDITOS"
        self.setEstadoAdmin = "ESPERANDO_DETALLE_ASIGNACION_CREDITOS"
        self.estadoClientes = "MOSTRANDO_DETALLE_ASIGNACION_CREDITOS"

    def confirmarDetalleAsignacion(self, client_id: int):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)


    #VOTACION EXCLUIR
    def iniciarVotacionExcluir(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_VOTAR_EXCLUIR"
        self.estadoAdmin = "ESPERANDO_VOTACION_EXCLUIR"
        self.estadoClientes = "CONFIRMANDO_VOTACION_EXCLUIR"
    
    def confirmarVotacionExcluir(self, client_id):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)

    def votarExcluir(self, client_id, votaPor):
        act = self.getActividad(self.actividadActual)
        act.votarExcluir(client_id, votaPor)

    def finalizarVotacionExcluir(self):
        act = self.getActividad(self.actividadActual)
        act.finalizarVotacionExcluir()

    #VOTACION INCLUIR
    def iniciarVotacionIncluir(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_VOTAR_INCLUIR"
        self.estadoAdmin = "ESPERANDO_VOTACION_INCLUIR"
        self.estadoClientes = "CONFIRMANDO_VOTACION_INCLUIR"

    def confirmarVotacionIncluir(self, client_id):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)

    def votarIncluir(self, client_id, votaPor):
        act = self.getActividad(self.actividadActual)
        act.votarIncluir(client_id, votaPor)

    def finalizarVotacionIncluir(self):
        act = self.getActividad(self.actividadActual)
        act.finalizarVotacionIncluir()

    #RESULTADOS EXCLUSION
    def mostrarResultadoExclusion(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_RESULTADO_EXCLUSION"
        self.estadoAdmin = "MOSTRANDO_RESULTADO_EXCLUSION"
        self.estadoClientes = "MOSTRANDO_RESULTADO_EXCLUSION"

    # CONFIRMACION DE LOS RESULTADOS DE EXCLUSION
    def confirmarResultadosVotacionExcluir(self, client_id):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)


    
    #RESULTADOS INCLUSION
    def mostrarResultadoInclusion(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_RESULTADO_INCLUSION"
        self.estadoAdmin = "MOSTRANDO_RESULTADO_INCLUSION"
        self.estadoClientes = "MOSTRANDO_RESULTADO_INCLUSION"

    # CONFIRMACION DE LOS RESULTADOS DE INCLUSION
    def confirmarResultadosVotacionIncluir(self, client_id):
        if not client_id in self.arrayDinamicoConfirmacion:
            self.arrayDinamicoConfirmacion.append(client_id)
    
    #RESUMEN ACTIVIDAD / ES
    def mostrarResumenActividad(self):
        #DEBEMOS REINICIAR EL ARRAY DINAMICO DE CONFIRMACION
        self.__reiniciarArrayDinamicoConfirmacion()

        #DEBEMOS MODIFICAR LOS ESTADOS DE LOS PROGRAMAS
        self.estado = "MOSTRAR_RESUMEN_ACTIVIDAD"
        self.estadoAdmin = "MOSTRANDO_RESUMEN_ACTIVIDAD"
        self.estadoClientes = "MOSTRANDO_RESUMEN_ACTIVIDAD"

    
manager = ConnectionManager()

try:
    f = open("appDB", "rb")
    entorno = pickle.load(f)
    f.close()
except:
    entorno = Entorno()

@app.websocket("/ws/{client_id}")

async def websocket_endpoint(websocket: WebSocket, client_id: int):
    if(manager.existeConeccion(client_id)):
        return

    await manager.connect(websocket,client_id)

    if client_id != 1000:
        # SE CONECTO UN USUARIO
        data = {"tipo": "NUEVA_CONEXION","usersOnline": manager.getJsonUsers()}

        #ACA ENVIAMOS QUE SE HA CONECTADO
        await manager.toAdminMensaje(json.dumps(data))

        # ENVIAMOS LOS DATOS DEL ENTORNO
        data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
        #ACA ENVIAMOS QUE SE HA CONECTADO
        await manager.toAdminMensaje(json.dumps(data))

    else:
        # SE CONECTO EL ADMIN
        print("SE ESTA CONECTADO EN ADMIN")

        # ENVIAMOS LOS DATOS DEL ENTORNO
        data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
        await manager.toAdminMensaje(json.dumps(data))

        data = {"tipo": "NUEVA_CONEXION_ADMIN","usersOnline": manager.getJsonUsers()}
        #ACA ENVIAMOS QUE SE HA CONECTADO
        await manager.toAdminMensaje(json.dumps(data))


    try:
            while True:
                data = await websocket.receive_text()
                dataJson = json.loads(data)
                
                tipo = dataJson["tipo"]
                data = dataJson["data"]

                if client_id == 1000:
                    match tipo:
                        case "CREAR_JUEGO":
                            #dataRecived = json.loads(data)
                            # SE DEBE CREAR EL JUEGO CON EL TRATAMIENTO INDICADO
                            tratamiento = data["tratamiento"]
                            nombreSesion = data["nombreSesion"]
                            actividades = 3
                            rondas = 12

                            # DEBEMOS ACTUALIZAR EL ENTONRO
                            entorno.crearJuego(nombreSesion, tratamiento, actividades, rondas)
                            entorno.setEstadoAdmin("ESPERANDO CONFIRMACION DE BIENVENIDO")
                            entorno.setEstadoClientes("MOSTRANDO INTERFAZ DE BIENVENIDO")
                            guardarEstadoApp(entorno)

                            # DEBEMOS ENVIARLE LA NUEVA INTERFAZ A TODOS
                            data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                            await manager.broadcast(json.dumps(data))

                            # DEBEMOS DECIRLE AL ADMIN QUE MUEESTRE LA TABLA
                            data = {"tipo": "MOSTRAR_TABLA","entorno": entorno.getDatosEntorno()}
                            await manager.toAdminMensaje(json.dumps(data))


                        case "INICIAR_SIGUIENTE_ACTIVIDAD":
                            print("INICIANDO LA SIGUIENTE ACTIVIDAD")
                            entorno.siguienteActividad()

                            # DEBEMOS ENVIARLE LA NUEVA INTERFAZ A TODOS
                            data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                            await manager.broadcast(json.dumps(data))

                        case "INICIAR_ENCUESTA":
                            entorno.iniciarEncuesta()
                            # DEBEMOS ENVIARLE LA NUEVA INTERFAZ A TODOS
                            data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                            await manager.broadcast(json.dumps(data))

                        case "EXPORTAR_CSV":
                            entorno.exportarDatos()
                        
                        case "EXPORTAR_ENCUESTAS_CSV":
                            entorno.exportarEncuestas()

                        case "EXPORTAR_PAGOS_CSV":
                            entorno.exportarPagos()
                            


                        
                        case _:
                            print("caso de default")
                else:
                    match tipo:
                        case "CLIENTE_SOLICITAR_ENTORNO":
                            #DEBEMOS ENVIARLE EL ENTORNO AL CLIENTE QUE CORRESPONDE --> client_id
                            # ENVIAMOS LOS DATOS DEL ENTORNO
                            data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                            await manager.send_personal_message(json.dumps(data),websocket)
                        
                        case "CONFIRMAR_BIENVENIDO":
                            entorno.confirmarBienvenido(client_id)
                            guardarEstadoApp(entorno)

                            if entorno.hanConfirmadoBienvenido_todos():
                                # DEBEMOS MOSTRAR EL COMIENZO DE LA ACTIVIDAD DE PRUEBA
                                entorno.iniciarActividadPrueba()
                                guardarEstadoApp(entorno)

                                #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))


                                print("confirmaron todoss")

                        case "CONFIRMAR_COMIENZO_ACTIVIDAD":
                            #DEBEMOS CONFIRMAR EL CLIENTE
                            entorno.confirmarComienzoActividad(client_id)
                            guardarEstadoApp(entorno)

                            if entorno.hanConfirmadoTodos():
                                #DEBEMOS INICIAR LA ASIGNACION DE LOS CREDITOS
                                entorno.iniciarAsignarCreditos()
                                guardarEstadoApp(entorno)
 
                                #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))

                        case "ENVIAR_ASIGNACION_CREDITOS":
                            # ASGINANDO LOS CREDITOS QUE LOS JUGADORES HAN ENVIADO
                            fichasClub = data["fichasClub"]
                            fichasActividadPrivada = data["fichasActividadPrivada"]
                            entorno.asignarCreditos(client_id, fichasClub, fichasActividadPrivada)

                            # CONFIRMANDO QUE YA NOS ENVIARON LOS CREDITOS
                            entorno.confirmarAsignacionCreditos(client_id)

                            #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO AL ADMIN ADMIN
                            data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                            await manager.toAdminMensaje(json.dumps(data))
                            guardarEstadoApp(entorno)
                                

                            if entorno.hanConfirmadoTodos():
                                #ACA DEBEMOS HACER EL CALCULO DE LAS GANANCIAS EXPERIMENTALES
                                entorno.calcularGanancias()
                                guardarEstadoApp(entorno)

                                # ACA DEBEMOS MOSTRAR EL DETALLE DE LA ASIGNACION
                                entorno.mostrarDetalleAsignacion()
                                #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))
                                guardarEstadoApp(entorno)

                        case "CONFIRMAR_DETALLE_ASIGNACION_CREDITOS":
                    
                            # CONFIRMANDO QUE YA NOS ENVIARON LOS CREDITOS
                            entorno.confirmarDetalleAsignacion(client_id)
                            guardarEstadoApp(entorno)

                            if entorno.hanConfirmadoTodos():
                                # DEBEMOS PREGUNTAR SI ES ULTIMA RONDA
                                # SI ES ULTIMA RONDA SE DEBE FINALIZAR LA ACTIVIDAD
                                if entorno.esUltimaRonda():
                                    #DEBEMOS FINALIZAR LA ACTIVIDAD
                                    entorno.finalizarActividad()

                                    # DEBEMOS MOSTRAR EL RESUMEN DE LA ACTIVIDAD POR CADA USUARIO
                                    entorno.mostrarResumenActividad()

                                    guardarEstadoApp(entorno)
                                    #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                    data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                    await manager.broadcast(json.dumps(data))

                                else:

                                    #DEBEMOS INCICIAR LA VOTACION DE EXCLUIR
                                    entorno.iniciarVotacionExcluir()
                                    guardarEstadoApp(entorno)

                                    #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                    data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                    await manager.broadcast(json.dumps(data))


                        case "ENVIAR_VOTACION_EXCLUIR":
                            tipo = data["tipo"]
                            if tipo == "VOTACION_AZUL":
                                client_id_voto = data["voto"]
                                entorno.confirmarVotacionExcluir(client_id)
                                entorno.votarExcluir(client_id,client_id_voto)
                                #ACA DEBEMOS PROCESAR EL VOTO DE LOS AZULES
                                guardarEstadoApp(entorno)

                            if tipo == "VOTACION_AMARILLO":
                                entorno.confirmarVotacionExcluir(client_id)
                                #SABEMOS QUE EL AMARILLO NO PUEDE VOTAR ENTONCES SOLO SE HACE UNA CONFIRMACION DE VOTO RECIBIDA
                                votoNo = data["voto"]
                                #ACA DEBEMOS GUARDAR EL VOTO DE LOS AMARILLOS
                                entorno.votarExcluir(client_id,votoNo)
                                #GUARDAMOS EL ESTADO DE LA APP
                                guardarEstadoApp(entorno)

                            if entorno.hanConfirmadoTodos():
                                # DEBEMOS FINALIZAR LA VOTACION DE EXCLUIR Y PROCESAR LOS RESULTADOS
                                entorno.finalizarVotacionExcluir()

                                #MOSTRAMOS LOS RESULTADOS DE EXCLUSION
                                entorno.mostrarResultadoExclusion()
                                guardarEstadoApp(entorno)

                                #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))

                        case "CONFIRMAR_RESULTADOS_VOTACION_EXCLUIR":
                            #DEBEMOS CONFIRMAR EL RESULTADO DE VOTACION PARA EL CLIENTE cliente_id
                            entorno.confirmarResultadosVotacionExcluir(client_id)
                            guardarEstadoApp(entorno)

                            if entorno.hanConfirmadoTodos():
                                print("iniciando votacion incluir")
                                entorno.iniciarVotacionIncluir()
                                guardarEstadoApp(entorno)
                                
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))


                        case "ENVIAR_VOTACION_INCLUIR":
                            tipo = data["tipo"]
                            if tipo == "VOTACION_AZUL":
                                client_id_voto = data["voto"]
                                entorno.confirmarVotacionIncluir(client_id)
                                entorno.votarIncluir(client_id,client_id_voto)
                                #ACA DEBEMOS PROCESAR EL VOTO DE LOS AZULES
                                guardarEstadoApp(entorno)

                            if tipo == "VOTACION_AMARILLO":
                                # CONFIRMAMOS LA VOTACION DEL AMARILLO
                                entorno.confirmarVotacionIncluir(client_id)
                                #EMPAQUETAMOS EL VOTO COMO UN NO
                                votoNo = data["voto"]
                                entorno.votarIncluir(client_id,votoNo)
                                # GUARDAMOS EL ESTADO DE LA APP
                                guardarEstadoApp(entorno)
                                

                            if entorno.hanConfirmadoTodos():
                                # DEBEMOS FINALIZAR LA VOTACION DE EXCLUIR Y PROCESAR LOS RESULTADOS
                                entorno.finalizarVotacionIncluir()
                                guardarEstadoApp(entorno)

                                #DEBEMOS MOSTRAR LOS EQUIPOS ACTUALES
                                entorno.mostrarResultadoInclusion()
                                guardarEstadoApp(entorno)

                                #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))

                                guardarEstadoApp(entorno)
                        
                        case "CONFIRMAR_RESULTADOS_VOTACION_INCLUIR":
                            #DEBEMOS CONFIRMAR EL RESULTADO DE VOTACION PARA EL CLIENTE cliente_id
                            entorno.confirmarResultadosVotacionIncluir(client_id)
                            guardarEstadoApp(entorno)

                            if entorno.hanConfirmadoTodos():
                                entorno.siguienteRonda()
                                entorno.iniciarAsignarCreditos()
                                guardarEstadoApp(entorno)
 
                                #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))

                        case "AUX_ENVIAR_ENCUESTA":
                            dataDict = json.loads(data)
                            print(dataDict["grupo"])
                            entorno.addEncuesta(dataDict)
                            entorno.confirmarEntregaEncuesta(client_id)

                            #DEBEMOS ENVIARLE EL ENTORNO AL CLIENTE QUE CORRESPONDE --> client_id
                            # ENVIAMOS LOS DATOS DEL ENTORNO
                            data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                            await manager.send_personal_message(json.dumps(data),websocket)
                            guardarEstadoApp(entorno)
                        
                            if entorno.hanConfirmadoTodos():
                                guardarEstadoApp(entorno)
                                #DEBEMOS ENVIAR EL CAMBIO DE ENTORNO MODO BROADCAST CLIENTES Y ADMIN
                                data = {"tipo": "DATOS_ENTORNO","entorno": entorno.getDatosEntorno()}
                                await manager.broadcast(json.dumps(data))

                        case _:
                            print("caso de default cliente")

                    #data = {"tipo": tipo}
                    #await manager.toClients(json.dumps(data))
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        data = {"tipo": "DESCONEXION","usersOnline": manager.getJsonUsers(), "desconexion_client_id": client_id}
        #ACA ENVIAMOS QUE SE HA DESCONECTADO
        await manager.toAdminMensaje(json.dumps(data))


