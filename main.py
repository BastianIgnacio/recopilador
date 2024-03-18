from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from datetime import datetime
import json
import time
import pickle
import csv
import random

"""
TRATAMIENTOS T1, T2, T3, T4, T5 
"""
#TRATAMIENTO VOTACION Y RONDAS Y RONDA ACTUAL
"""
    // BIENVENIDO
    // ASIGNAR_CREDITOS
    // RESUMEN_ASIGNACION_CREDITOS
    // MOSTRAR_RESULTADOS_RONDA_Y_VOTACION
    // MOSTRAR_RESULTADOS_VOTACION

    // MOSTRAR_FINALIZAR_ACTIVIDAD
    // MOSTRAR_FINALIZAR_ACTIVIDAD_PRUEBA
    // MOSTRAR_FINALIZAR_SESION

    // FINALIZAR_SESION_AGRADECIMIENTOS
"""

dictParticipantes = ['A','B','C','D','E','F']


# aca debemos cargar el archivo que siempre vamos guardando (serializando)
app = FastAPI()

class User:
    def __init__(self, ws: WebSocket, client_id: str):
        self.ws = ws
        self.client_id = client_id

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[User] = []

    async def connect(self, websocket: WebSocket, client_id: str):
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
            dataJson.append({"client_id": connection.client_id})
        return json.dumps(dataJson)
    def existeConeccion(self, client_id: str):
        for user in self.active_connections:
            if user.client_id == client_id:
                return True
        return False
    async def broadcastClients(self, message: str):
        for connection in self.active_connections:
            if connection.client_id != 1000:
                await connection.ws.send_text(message)


class AsignacionFichas:
    def __init__(self, client_id: str, numeroRonda: int, fichasClub: int, fichasActividadPrivada: int, club: str, tratamiento: str, porcentajeVigilancia: int):
        self.client_id = client_id
        self.numeroRonda = numeroRonda
        # CLUB ACTUAL AL QUE PERTENECE EL JUGADOR
        self.club = club 
        self.fichasClub = fichasClub
        self.fichasActividadPrivada = fichasActividadPrivada
        self.fichasRetiroTotalClubAzul = 0
        self.costoMonitoreoPorJugador = 0
        self.cantidadJugadoresAmarillos = 0
        self.costoDeMonitoreo = 0
        self.gananciasPesosExperimentales = 0
        self.tratamiento = tratamiento
        self.dateTime = datetime.now()

        self.porcentajeVigilancia = porcentajeVigilancia
        self.fueMonitoreado = False
        self.fueMultado = False
        self.multa = 0

    def exportar(self):
        data = {}
        data['client_id'] = self.client_id
        data['numeroRonda'] = self.numeroRonda
        data['club'] = self.club
        data['fichasClub'] = self.fichasClub
        data['fichasActividadPrivada'] = self.fichasActividadPrivada
        data['fichasRetiroTotalClubAzul'] = self.fichasRetiroTotalClubAzul
        data['costoDeMonitoreo'] = self.costoDeMonitoreo
        data['gananciasPesosExperimentales'] = self.gananciasPesosExperimentales
        data['tratamiento'] = self.tratamiento
        data['porcentajeVigilancia'] = self.porcentajeVigilancia
        data['fueMonitoreado'] = self.fueMonitoreado
        data['fueMultado'] = self.fueMultado
        data['multa'] = self.multa
        data['cantidadJugadoresAmarillos'] = self.cantidadJugadoresAmarillos
        data['costoMonitoreoPorJugador'] = self.costoMonitoreoPorJugador
        return data

    def calcularGanancias(self):
        if self.tratamiento == "T2":
            self.costoDeMonitoreo = 0
            if self.club == "AMARILLO":
                self.fichasActividadPrivada = 5
                self.fichasClub = 0
                self.gananciasPesosExperimentales = 5
            if self.club == "AZUL":
                a = self.fichasClub
                b = self.fichasRetiroTotalClubAzul - self.fichasClub
                self.gananciasPesosExperimentales = (5-a)+ 4*(a)+2*(30-b-a) - self.costoDeMonitoreo
        # PARA TRATAMIENTOS DISTINTOS DE T2
        else:
            a = self.fichasClub
            b = self.fichasRetiroTotalClubAzul - self.fichasClub
            # EL COSTO DE MONITOREO SOLO APLICA CUANDO ES DEL GRUPO AZUL
            if self.club == "AMARILLO":
                self.costoDeMonitoreo = 0
                self.gananciasPesosExperimentales = (5-a)+ 4*(a)
            else:
                self.gananciasPesosExperimentales = (5-a)+ 4*(a)+2*(30-b-a) - self.costoDeMonitoreo

    def fiscalizar(self):
        if self.club == "AMARILLO":
            num = random.randint(1,100)
            if num <= self.porcentajeVigilancia:
                # se fiscaliza
                self.fueMonitoreado = True
                if self.fichasClub > 0:
                    multaAux = 8 * self.fichasClub
                    self.fueMultado = True
                    self.multa = multaAux
                    self.gananciasPesosExperimentales = self.gananciasPesosExperimentales - multaAux
                else:
                    self.fueMultado = False

    def imprimir(self):
        print(self.client_id + " " + str(self.numeroRonda) + " " + self.club)
 

class ResultadoJugador:
    def __init__(self, client_id, grupo, actividad, pesosExperimentales, pesos, factorConversion):
        self.client_id = client_id
        self.grupo = grupo
        self.actividad = actividad
        self.pesosExperimentales = pesosExperimentales
        self.pesos = pesos
        self.factorConversion = factorConversion

class Encuesta:
    def __init__(self,grupo,integrante,genero,edad,universidad,carrera,anoCursando,anoEsperaTenerCumplidoRequisitos,ingresoFamilia,integrantesFamilia,perteneceAlgunClub,reelevanteClub):
        self.grupo = grupo
        self.integrante = integrante
        self.genero = genero
        self.edad = edad
        self.universidad = universidad
        self.carrera = carrera
        self.anoCursando = anoCursando
        self.anoEsperaTenerCumplidoRequisitos = anoEsperaTenerCumplidoRequisitos
        self.ingresoFamilia = ingresoFamilia
        self.integrantesFamilia = integrantesFamilia
        self.perteneAClub = perteneceAlgunClub
        self.reelevanteClub = reelevanteClub

    def imprimir(self):
        print("************************")
        print("grupo :" + str(self.grupo))
        print("integrante :" + str(self.integrante))
        print("genero :" + self.genero)
        print("edad :" + str(self.edad))
        print("universidad :" + self.universidad)
        print("carrera :" + self.carrera)
        print("anoCursando :" + str(self.anoCursando))
        print("anoEsperaTenerCumplidoRequisitos :" + str(self.anoEsperaTenerCumplidoRequisitos))
        print("ingresoFamilia :" + str(self.ingresoFamilia))
        print("integrantesFamilia :" + str(self.integrantesFamilia))
        print("perteneAClub :" + str(self.perteneAClub))
        print("reelevanteClub :" + str(self.reelevanteClub))
        print("************************")
    


class Jugador:
    def __init__(self, client_id: str, gananciaBase: int):
        self.client_id = client_id
        self.club = "AZUL"
        self.gananciaBase = gananciaBase
        self.grupo = 1

    def formatear(self):
        self.club = "AZUL"


class Voto:
    def __init__(self, client_id: str, votacion: str, ronda: int):
        self.ronda = ronda
        self.client_id = client_id
        self.votacion = votacion

class Tratamiento:
    def __init__(self, tratamiento: str, costoDeMonitoreo: str, esPrueba, rondas : int , porcentajeVigilancia : int, factorConversion: int):
        self.tratamiento = tratamiento
        self.costoDeMonitoreo = costoDeMonitoreo
        self.esPrueba = esPrueba
        self.rondas = rondas
        self.porcentajeVigilancia = porcentajeVigilancia
        self.asignaciones = []
        self.factorConversion = factorConversion

    def imprimirAsignaciones(self):
        for asig in self.asignaciones:
            asig.imprimir()





class JugadoresManager:
    def __init__(self, basePesosChilenos: int, dictJugadores, arrayTratamientos):

        self.grupo = 1

        self.dateTime = datetime.now()
        year = self.dateTime.strftime("%Y")
        month = self.dateTime.strftime("%m")
        day = self.dateTime.strftime("%d")
        hora = self.dateTime.strftime("%X")

        self.sesionId = year+"-"+month+"-"+day+"-"+hora+"-"+str(self.grupo)

        print(self.sesionId)

        self.resultadosJugadores = []
        self.actividad = 1

        #DATOS DE LAS ENCUESTAS REALIZADAS
        self.encuestas = []

        # para saber el tiempo en que se creo la sesion
        self.fecha = datetime.now()

        # lista de tratamientos que vamos a realizar
        self.tratamientos = arrayTratamientos
        self.basePesosChilenos = basePesosChilenos

        # PARA VER EN QUE TRATAMIENTO ESTAMOS
        self.numeroTratamiento = 0
        self.tratamientoObjeto = arrayTratamientos[self.numeroTratamiento]
        self.tratamiento = arrayTratamientos[self.numeroTratamiento].tratamiento
        self.costoDeMonitoreo = arrayTratamientos[self.numeroTratamiento].costoDeMonitoreo
        self.rondasTotales = arrayTratamientos[self.numeroTratamiento].rondas
        self.tratamientoDePrueba = arrayTratamientos[self.numeroTratamiento].esPrueba
        self.factorConversion = arrayTratamientos[self.numeroTratamiento].factorConversion

        # porcentaje de vigilacia del 50%
        self.porcentajeVigilancia = arrayTratamientos[self.numeroTratamiento].porcentajeVigilancia

        # Rondas y Ronda actual
        self.rondaActual = 1

        # JUGADORES Y ASIGNACIONES DEL TRATAMIENTO ACTUAL
        self.jugadores = []
        self.asignaciones = []
        self.votosApilados = []

        self.votos = []

        self.dictJugadores = dictJugadores
        self.notificaciones = []
        self.traslados = []
    
        # PARA CHECKEAR QUIIENES HAN VOTADO Y QUIEN NO
        self.arrayParticipantesDinamicoBienvenido = dictJugadores.copy()
        self.arrayParticipantesDinamicoAsignarFichas =  dictJugadores.copy()
        self.arrayParticipantesDinamicoVotacion= dictJugadores.copy()
        self.arrayParticipantesDinamicoEncuesta = dictJugadores.copy()

        #VISTA ACTUAL
        self.vistaActual = "BIENVENIDO"

    def exportarAsignaciones(self):
        array = []
        for asig in self.asignaciones:
            array.append(asig.exportar())
        return array

    def buscarVotos(self, cliente, ronda):
        array = []
        for v in self.votosApilados:
            if v.client_id == cliente and (v.ronda == ronda + 1):
                array.append(v.votacion)
        return array

    def generarArrayVotacionesVacio(self, client_id, club):

        array = []
        if club == "AMARILLO":
            for j in self.dictJugadores:
                array.append('.')
            return array

        for j in self.dictJugadores:
            array.append('0')
    
        i = 0
        for j in self.dictJugadores:
            if j == client_id:
                array[i] = "."
            i = i + 1 
        return array
    
    def escribirVotacion(self, array, votacion, client_id):
        i = 0
        for j in self.dictJugadores:
            if j == votacion:
                array[i] = '1'
            # ES PARA SABER LA UBICACION EN LA QUE NOS ENCONTRAMOS
            i = i + 1

    def exportarFaseACsv(self):
        
        nombreArchivo = "actividad_" + str(self.numeroTratamiento + 1) + ".csv"
        with open(nombreArchivo, mode='w', newline='') as file:

            headers = ['sesion_id','actividadDePrueba','client_id', 'numeroRonda', 'hora', 'club','fichasClub','fichasActividadPrivada','fichasRetiroTotalClubAzul','costoDeMonitoreo','gananciasPesosExperimentales','tratamiento']
            for j in self.dictJugadores:
                headers.append("votaPor_" + str(j))
            asigArray = []
            for asigAux in self.asignaciones:
                arrayToAsig = [self.sesionId, str(self.tratamientoDePrueba) , asigAux.client_id ,asigAux.numeroRonda ,asigAux.dateTime.strftime("%X"), asigAux.club, asigAux.fichasClub, asigAux.fichasActividadPrivada, asigAux.fichasRetiroTotalClubAzul, asigAux.costoDeMonitoreo, asigAux.gananciasPesosExperimentales, asigAux.tratamiento]
                #************************* ACA VAMOS A GENERAR LOS VOTOS
                client_id = asigAux.client_id
                ronda = asigAux.numeroRonda
                club = asigAux.club
                votosEnEstaRonda = self.buscarVotos(client_id,ronda)
                print("El jugador " + str(client_id) + " ha votado por:")
                print("votos en esta ronda")
                print(votosEnEstaRonda)

                # votosEnEstaRonda = ['C','D']


                # GENERAMOS UN ARAY CON PUROS CEROS
                arrayVotosAux = self.generarArrayVotacionesVacio(client_id, club)

                for j in votosEnEstaRonda:
                    self.escribirVotacion(arrayVotosAux, j, client_id)
                
                print(arrayVotosAux)

                for element in arrayVotosAux:
                    arrayToAsig.append(element)

                #***************************
                #Ahora debemos buscar todos los votos que se hicieron en esa ronda
                asigArray.append(arrayToAsig)
            writer = csv.writer(file)
            writer.writerow( headers) # Creamos las columnas

            for asigAux in asigArray:
                writer.writerow(asigAux)

    def exportarEncuestasACSV(self):
        nombreArchivo = "encuestas.csv"
        with open(nombreArchivo, mode='w', newline='') as file:

            headers = ['sesion_id','grupo', 'integrante', 'genero', 'edad','universidad','carrera','anoCursando','anoEsperaTenerCumplidoRequisitos','ingresoFamilia','integrantesFamilia','perteneAClub','reelevanteClub']
            writer = csv.writer(file)
            writer.writerow( headers) # Creamos las column

            encArray = []
            for encAux in self.encuestas:
                encArray.append([self.sesionId,encAux.grupo, encAux.integrante, encAux.genero, encAux.edad,encAux.universidad,encAux.carrera,encAux.anoCursando,encAux.anoEsperaTenerCumplidoRequisitos,encAux.ingresoFamilia,encAux.integrantesFamilia,encAux.perteneAClub,encAux.reelevanteClub])
            
            for encAux in encArray:
                writer.writerow(encAux)
    
    def exportarResultadosJugadoresCsv(self):

        nombreArchivo = "resultadosGanancias.csv"
        with open(nombreArchivo, mode='w', newline='') as file:

            headers = ['jugador', 'Dinero',]
            writer = csv.writer(file)
            writer.writerow( headers) # Creamos las column

            writerArray = []
            
            for j in self.jugadores:
                client_id = j.client_id
                total = j.gananciaBase
                for rj in self.resultadosJugadores:
                    if rj.client_id == client_id:
                        total = total + rj.pesos
                writerArray.append([client_id,"$ " + str(total)])
            for wAux in writerArray:
                writer.writerow(wAux)
               

    def guardarResultadosActividad(self):
        #guardamos las asignaciones en el tratamiento
        self.tratamientoObjeto.asignaciones = self.asignaciones

        if not self.tratamientoDePrueba:
            # GUARDAMOS EL RESULTADO DE LOS JUGADORES PARA CADA ACTIVIDAD
            for j in self.jugadores:
                ganaciaPesosExperimentales = self.calcularGananciasAcumuladas(j.client_id)
                pesos = self.factorConversion * ganaciaPesosExperimentales

                if ganaciaPesosExperimentales > 0:
                    rj = ResultadoJugador(j.client_id, "club", self.actividad, ganaciaPesosExperimentales , pesos, self.factorConversion)
                    self.resultadosJugadores.append(rj)
                else:
                    rj = ResultadoJugador(j.client_id, "club", self.actividad, ganaciaPesosExperimentales , 0, self.factorConversion)
                    self.resultadosJugadores.append(rj)
                
            self.actividad = self.actividad + 1

    def siguienteActividad(self):
    
        # entramos al siguiente tratamiento y formateamos todas las variables que son dinamicas
        self.numeroTratamiento = self.numeroTratamiento + 1
        self.tratamientoObjeto = self.tratamientos[self.numeroTratamiento]
        self.tratamiento = self.tratamientos[self.numeroTratamiento].tratamiento
        self.costoDeMonitoreo = self.tratamientos[self.numeroTratamiento].costoDeMonitoreo
        self.rondasTotales = self.tratamientos[self.numeroTratamiento].rondas
        self.tratamientoDePrueba = self.tratamientos[self.numeroTratamiento].esPrueba
        self.factorConversion = self.tratamientos[self.numeroTratamiento].factorConversion
        self.porcentajeVigilancia = self.tratamientos[self.numeroTratamiento].porcentajeVigilancia
        self.rondaActual = 1
        self.asignaciones = []

        for j in self.jugadores:
            j.formatear()
        
        self.arrayParticipantesDinamicoBienvenido = self.dictJugadores.copy()
        self.arrayParticipantesDinamicoAsignarFichas =  self.dictJugadores.copy()
        self.arrayParticipantesDinamicoVotacion= self.dictJugadores.copy()

        self.notificaciones = []
        self.traslados = []
        self.votos = []


    def existeSiguienteActividad(self):
        if len(self.tratamientos) == (self.numeroTratamiento + 1):
            print('retornando false en siguiente actividad')
            return False
        else:
            return True

    def formatearArrayBienvenido(self):
        self.arrayParticipantesDinamicoBienvenido = self.dictJugadores.copy()

    def formatearArrayAsignarFichas(self):
        if self.tratamiento == "T2":
            self.arrayParticipantesDinamicoAsignarFichas = self.dictJugadores.copy()
            for j in self.jugadores:
                if j.club == "AMARILLO":
                    self.arrayParticipantesDinamicoAsignarFichas.remove(j.client_id)
        else:
            self.arrayParticipantesDinamicoAsignarFichas =  self.dictJugadores.copy()

    def formatearArrayVotacion(self):
        ## SOLO LOS JUGADORES DEL CLUB AZUL PUEDEN VOTAR 
        self.arrayParticipantesDinamicoVotacion = self.dictJugadores.copy()
        """
        for j in self.jugadores:
            if j.club == "AMARILLO":
                self.arrayParticipantesDinamicoVotacion.remove(j.client_id)
        """
        self.votos = []

    def haVotado(self, jugador:str):
        if jugador in self.arrayParticipantesDinamicoVotacion:
            return False
        return True

    def haAsignadoFichas(self, jugador:str):
        if jugador in self.arrayParticipantesDinamicoAsignarFichas:
            return False
        return True

    def haIniciado(self, jugador:str):
        if jugador in self.arrayParticipantesDinamicoBienvenido:
            return False
        return True

    def hanIniciadoTodos(self):
        if len(self.arrayParticipantesDinamicoBienvenido) == 0:
            return True
        return False

    def hanEncuestadoTodos(self):
        if len(self.arrayParticipantesDinamicoEncuesta) == 0:
            return True
        return False
    
    def encuestaRecibida(self, jugador:str):
        self.arrayParticipantesDinamicoEncuesta.remove(jugador)

    def haEntregadoEncuesta(self, jugador:str):
        if jugador in self.arrayParticipantesDinamicoEncuesta:
            return False
        return True

    def iniciarFase(self, jugador:str):
        self.arrayParticipantesDinamicoBienvenido.remove(jugador)
    
    def votar(self, jugador: str, array, ronda:int):
        if len(array) == 0:
            # no voto por nadie
            self.arrayParticipantesDinamicoVotacion.remove(jugador)
            return
        
        if (len(array) == 1) and array[0]=="no":
            self.arrayParticipantesDinamicoVotacion.remove(jugador)
            return
        
        for v in array:
            voto = Voto(jugador, v, ronda)
            self.votos.append(voto)
            self.votosApilados.append(voto)
        self.arrayParticipantesDinamicoVotacion.remove(jugador)
    
    def votarEnFalso(self, jugador:str):
        self.arrayParticipantesDinamicoVotacion.remove(jugador)

    
    def hanVotadoTodos(self):
        if len(self.arrayParticipantesDinamicoVotacion) == 0:
            return True
        return False
    
    def addAsignacionJugador(self, client_id: str, numeroRonda: int, fichasClub: int, fichasActividadPrivada: int, club: str):
        asig = AsignacionFichas(client_id, numeroRonda, fichasClub, fichasActividadPrivada, club, self.tratamiento, self.porcentajeVigilancia)
        self.asignaciones.append(asig)
        self.arrayParticipantesDinamicoAsignarFichas.remove(client_id)
    
    def generarAsignacionesAutomaticas(self):
        for j in self.jugadores:
            if j.club == "AMARILLO":
                asig = AsignacionFichas(j.client_id, self.rondaActual , 0, 5, j.club, self.tratamiento, self.porcentajeVigilancia)
                self.asignaciones.append(asig)

    def hanAsignadoTodos(self):
        if len(self.arrayParticipantesDinamicoAsignarFichas) == 0:
            return True
        return False

    def calcularVotacionJugador(self, client_id: str):
        cantidadVotosRecibidos = 0
        cantidadJugadoresClubAzul = 0
        for j in self.jugadores:
            if j.club == "AZUL":
                cantidadJugadoresClubAzul +=1
        
        for v in self.votos:
            if v.votacion == client_id:
                cantidadVotosRecibidos +=1

        porcentaje = (cantidadVotosRecibidos/cantidadJugadoresClubAzul) * 100

        if porcentaje >= 50:
            return [client_id, "AMARILLO", porcentaje, cantidadJugadoresClubAzul, cantidadVotosRecibidos]
 
        else:
            return [client_id, "AZUL", porcentaje, cantidadJugadoresClubAzul, cantidadVotosRecibidos]

    def calcularVotacion(self):
        arrayResultados = []
        for j in self.dictJugadores:
            arrayResultados.append(self.calcularVotacionJugador(j))
        arrayNotificaciones = []
        jugadoresEnviadosGrupoAmarillo = []
        for a in arrayResultados:
            # DEBEMOS INGRESAR LOS RESULTADOS A LA BD
            # DEBEMOS MOFIDICAR LOS DATOS DEL JUGADOR
            jugador = self.buscarJugador(a[0])
            #QUIERE DECIR QUE EL JUGADOR HA SIDO TRANSLADADO AL GRUPO AMARILLO
            if jugador.club == "AZUL" and a[1] == "AMARILLO":
                # enviamos al jugador al grupo amarillo
                jugador.club = "AMARILLO"              

                # creamos las notificaciones
                data = {}
                data['client_id'] = jugador.client_id
                data['color'] = "AMARILLO"
                data['mensaje'] = "El jugador " + jugador.client_id + " ha sido enviado al club Amarillo"
                arrayNotificaciones.append(json.dumps(data))
                # sabemos quienes fueron transladados, para hacer la transicion en el front
                jugadoresEnviadosGrupoAmarillo.append(jugador.client_id)
            #DEBEMOS CREAR LAS NOTIFICACIONES

        if len(jugadoresEnviadosGrupoAmarillo) == 0:
            data = {}
            data['client_id'] = 1000
            data['color'] = "PLOMO"
            data['mensaje'] = "Ningun jugador ha sido enviado al club amarillo"
            arrayNotificaciones.append(json.dumps(data))            

        self.notificaciones = arrayNotificaciones
        self.traslados = jugadoresEnviadosGrupoAmarillo

    def getNotificaciones(self):
        return json.dumps(self.notificaciones)
    def formatearNotificaciones(self):
        self.notificaciones = []

    
    def getTraslados(self):
        return json.dumps(self.traslados)
    def formatearTraslados(self):
        self.traslados = []
    
    def imprimirVotos(self):
        for v in self.votos:
            print( str(v.ronda) + " " + v.client_id + " " + v.votacion)

    

    def escribirRetiro(self, ronda: int, client_id: str,arrayToReturn):
        for asig in self.asignaciones:
            if asig.numeroRonda == ronda and asig.client_id == client_id:
                arrayToReturn['ronda_'+str(ronda)] = asig.fichasClub
                return
        arrayToReturn['ronda_'+str(ronda)] = "-"
        return
    ## calculammos las ganancias de todas las asignaciones que corresponden a un jugador 
    def calcularGananciasAcumuladas(self, client_id: str):
        ganancia = 0
        for asig in self.asignaciones:
            if asig.client_id == client_id:
                ganancia = ganancia + asig.gananciasPesosExperimentales
        return ganancia
    # buscamos un jugador
    def buscarJugador(self, client_id: str):
        for jugador in self.jugadores:
            if jugador.client_id == client_id:
                return jugador
        print("NO SE ENCONTRO EL JUGADOR")        
        return None


    def escribirGananciaUltimaRonda(self, client_id: str,arrayToReturn):
        rondaEscribir = None
        if self.rondaActual == 1:
            rondaEscribir = 1
        else:
            rondaEscribir = self.rondaActual - 1

        # buscar la ultima ronda
        asigRonda = None
        for asig in self.asignaciones:
            if asig.client_id == client_id:
                if asig.numeroRonda == rondaEscribir:
                    asigRonda = asig

        if asigRonda is None:
            #  ya tenemos la ultima ronda y la asig correspondiuente
            arrayToReturn['ganancia_ultima_ronda'] = "-"
        else:
            #ya tenemos la ultima ronda y la asig correspondiuente
            arrayToReturn['ganancia_ultima_ronda'] = 'E$ ' + str(asigRonda.gananciasPesosExperimentales)
        return


    def exportarRetiroTotal(self, rondas: int):
        arrayToReturn = {}
        arrayToReturn['id'] = "retiros_totales"
        arrayToReturn['jugador'] = "Retiros totales"
        arrayToReturn['club'] = "total"
        arrayToReturn['headerClub'] = "Total retiros entre ambos clubes"

        grupoSumatoria = 0
        for i in range(rondas):
            for asig in self.asignaciones:
                if (asig.numeroRonda == i+1):
                    grupoSumatoria = grupoSumatoria + asig.fichasClub
            arrayToReturn['ronda_'+str(i+1)] = grupoSumatoria
            grupoSumatoria = 0
        arrayToReturn['ganancia_ultima_ronda'] = "-"
        arrayToReturn['gananciaAcumulada'] = "-"
        return arrayToReturn
    

    # creamos la tabla con los resultados por cada jugador
    def exportarTablaJugador(self, jugador:str):
        jugadorExp = self.buscarJugador(jugador)
        # JUGADOR NO EXISTE
        if jugadorExp is None:
            print("jugador no existe")
            return
        
        arrayToReturn = {}
        arrayToReturn['id'] = jugadorExp.client_id
        arrayToReturn['jugador'] = "Jugador "+ jugadorExp.client_id
        arrayToReturn['club'] = self.getClubJugador(jugadorExp.client_id)
        for i in range(10):
            self.escribirRetiro(i+1,jugadorExp.client_id,arrayToReturn)
        self.escribirGananciaUltimaRonda(jugadorExp.client_id, arrayToReturn)
        gananciaAcumuladaPesosExperimentales = self.calcularGananciasAcumuladas(jugadorExp.client_id)
        arrayToReturn['gananciaAcumulada'] = 'E$ ' + str(gananciaAcumuladaPesosExperimentales)
        return arrayToReturn


    def exportarTablaEstadoJugadores(self):
        arrayToReturn = []
        for j in self.jugadores:
            data = {}
            data['client_id'] = j.client_id
            data['club'] = j.club
            arrayToReturn.append(data)
        return arrayToReturn

    def exportarTablaResultadosJugadores(self):
        arrayToReturn = []
        for j in self.jugadores:
            data = {}
            data['rowTotal'] = False
            data['client_id'] = j.client_id
            data['grupo'] = "-"
            data['actividad'] = "Base"
            data['pesosExperimentales'] = "-"
            data['valorPesoExperimental'] = "-"
            data['pesos'] = "$ " + str(j.gananciaBase)
            arrayToReturn.append(data)

        for rj in self.resultadosJugadores:
            data = {}
            data['rowTotal'] = False
            data['client_id'] = rj.client_id
            data['grupo'] = rj.grupo
            data['actividad'] = rj.actividad
            data['pesosExperimentales'] = "E$ " + str(rj.pesosExperimentales)
            data['valorPesoExperimental'] = str(rj.factorConversion)
            data['pesos'] = "$ " + str(rj.pesos)
            arrayToReturn.append(data)
        
        for j in self.jugadores:
            client_id = j.client_id

            total = j.gananciaBase
            for rj in self.resultadosJugadores:
                if rj.client_id == client_id:
                    total = total + rj.pesos
            data = {}
            data['rowTotal'] = True
            data['client_id'] = client_id
            data['actividad'] = "-"
            data['pesosExperimentales'] = "-" 
            data['valorPesoExperimental'] = "TOTAL"
            data['pesos'] = "$ " + str(total)
            arrayToReturn.append(data)
    
        return arrayToReturn

    def exportarTablaRetirosJugadores(self):
        arrayTablasJugadores = []
        for j in self.dictJugadores:
            table = self.exportarTablaJugador(j)
            arrayTablasJugadores.append(table)
        tablaRetiroTotal = self.exportarRetiroTotal(10)
        arrayTablasJugadores.append(tablaRetiroTotal)
        return arrayTablasJugadores
    
    
    def moverAlClubAmarillo(self, jugador: str):
        for j in self.jugadores:
            if j.client_id == jugador:
                j.club = "AMARILLO"

    def getClubJugador(self, jugador: str):
        for j in self.jugadores:
            if j.client_id == jugador:
                return j.club


    def crearJugadoresGrupo1(self):
        for j in self.dictJugadores:
            jugador = Jugador(j, self.basePesosChilenos)
            self.jugadores.append(jugador)

    def exportarResumenRondasJugador(self, client_id: str):
        arrayToReturn = {}
        arrayToReturn['id'] = client_id
        arrayToReturn['jugador'] = "Jugador "+ client_id

        # DEBEMOS RECORRER TODAS LAS 
        for asig in self.asignaciones:
            if asig.client_id == client_id:
                ronda = asig.numeroRonda
                arrayToReturn['ronda_'+str(ronda)] = json.dumps(asig)
        return arrayToReturn
    
    def exportarResumenRondas(self):
        array = []
        for j in self.dictJugadores:
            table = self.exportarResumenRondasJugador(j)
            array.append(table)
        return array

    def getInfoFase(self):
        arrayDict = {}
        arrayDict['tratamiento'] = self.tratamiento

        arrayDict['basePesosChilenos'] = self.basePesosChilenos

        # T1 T2 T3 T4 T5 tratamiento actu
        arrayDict['numeroTratamiento'] = self.numeroTratamiento
        arrayDict['costoDeMonitoreo'] = self.costoDeMonitoreo 
        # porcentaje de vigilacia del 50%
        arrayDict['porcentajeVigilancia'] = self.porcentajeVigilancia 

        # Rondas y Ronda actual
        arrayDict['rondaActual'] = self.rondaActual 
        arrayDict['rondasTotales'] = self.rondasTotales     

        return arrayDict

    def siguienteRonda(self):
        self.rondaActual = self.rondaActual + 1
    
    def esRondaFinal(self):
        return self.rondaActual == self.rondasTotales + 1

    # FUNCION PARA CALCULAR LOS PESOS EXPERIMENTALES DE LA RONDA
    def calcularPesosExperimentalesRonda(self, ronda: int):

        if(self.tratamiento == "T1"):
            #DEBEMOS BUSCAR TODAS LAS ASIGNACIONES DE LA RONDA EN ESPECIFICO
            arrayAsignacionesRondasAux = []
            for asig in self.asignaciones:
                if ronda == asig.numeroRonda:
                    arrayAsignacionesRondasAux.append(asig)

            # CALCULAMOS TODAS LAS FICHAS DEL CLUB AZUL RETIRADAS EN LA RONDA
            auxFichasClub = 0
            for asigAux in arrayAsignacionesRondasAux:
                auxFichasClub = auxFichasClub + asigAux.fichasClub
            
            # AHORA DEBEMOS SETEAR LAS FICHAS DEL RETIRO DEL CLUB Y CALCULAR LAS GANACIAS EXPERIMENTALES
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.fichasRetiroTotalClubAzul = auxFichasClub
                asigAux.calcularGanancias()

        # hay expulsion, los amarillos no pueden retirar de la cuenta del club azul 
        if(self.tratamiento == "T2"):
            #DEBEMOS BUSCAR TODAS LAS ASIGNACIONES DE LA RONDA EN ESPECIFICO
            arrayAsignacionesRondasAux = []
            for asig in self.asignaciones:
                if ronda == asig.numeroRonda:
                    arrayAsignacionesRondasAux.append(asig)

            # CALCULAMOS TODAS LAS FICHAS DEL CLUB AZUL RETIRADAS EN LA RONDA
            # ACA LOS JUGADORES PUEDEN PERTENECEER AL CLUB AMARILLO, SOLO SE TOMAN EN CUENTA LOS QUE PERTENECEN AL CLUB AZUL
            auxFichasClub = 0
            for asigAux in arrayAsignacionesRondasAux:
                if asigAux.club == "AZUL" :
                    auxFichasClub = auxFichasClub + asigAux.fichasClub
            
            # AHORA DEBEMOS SETEAR LAS FICHAS DEL RETIRO DEL CLUB Y CALCULAR LAS GANACIAS EXPERIMENTALES
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.fichasRetiroTotalClubAzul = auxFichasClub
                asigAux.calcularGanancias()


        ## hay expulsioin. pero los amarillos si pueden robar de la cuenta del club azul
        if(self.tratamiento == "T3"):
            #DEBEMOS BUSCAR TODAS LAS ASIGNACIONES DE LA RONDA EN ESPECIFICO
            arrayAsignacionesRondasAux = []
            for asig in self.asignaciones:
                if ronda == asig.numeroRonda:
                    arrayAsignacionesRondasAux.append(asig)

            # CALCULAMOS TODAS LAS FICHAS DEL CLUB AZUL RETIRADAS EN LA RONDA
            auxFichasClub = 0
            for asigAux in arrayAsignacionesRondasAux:
                auxFichasClub = auxFichasClub + asigAux.fichasClub
            
            # AHORA DEBEMOS SETEAR LAS FICHAS DEL RETIRO DEL CLUB Y CALCULAR LAS GANACIAS EXPERIMENTALES
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.fichasRetiroTotalClubAzul = auxFichasClub
                asigAux.calcularGanancias()

        ## hay expulsioin. pero los amarillos si pueden robar de la cuenta del club azul y existe costo de monitoreo 2
        if(self.tratamiento == "T4"):
            #DEBEMOS BUSCAR TODAS LAS ASIGNACIONES DE LA RONDA EN ESPECIFICO
            arrayAsignacionesRondasAux = []
            for asig in self.asignaciones:
                if ronda == asig.numeroRonda:
                    arrayAsignacionesRondasAux.append(asig)

            # CALCULAMOS TODAS LAS FICHAS DEL CLUB AZUL RETIRADAS EN LA RONDA
            # ACA LOS JUGADORES PUEDEN PERTENECEER AL CLUB AMARILLO, SOLO SE TOMAN EN CUENTA LOS QUE PERTENECEN AL CLUB AZUL
            auxFichasClub = 0
            cantidadAmarillos = 0
            for asigAux in arrayAsignacionesRondasAux:
                if asigAux.club == "AZUL":
                    auxFichasClub = auxFichasClub + asigAux.fichasClub
                else:
                    auxFichasClub = auxFichasClub + asigAux.fichasClub
                    cantidadAmarillos = cantidadAmarillos + 1

            # AHORA DEBEMOS ASIGNAR EL COSTO DE MONITOREO PARA CADA UNA DE LAS ASIGNACIONES
            cm = cantidadAmarillos * self.costoDeMonitoreo
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.costoDeMonitoreo = cm
                asigAux.cantidadJugadoresAmarillos = cantidadAmarillos
                asigAux.costoMonitoreoPorJugador = self.costoDeMonitoreo

            # AHORA DEBEMOS SETEAR LAS FICHAS DEL RETIRO DEL CLUB Y CALCULAR LAS GANACIAS EXPERIMENTALES
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.fichasRetiroTotalClubAzul = auxFichasClub
                asigAux.calcularGanancias()
            
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.fiscalizar()

        if(self.tratamiento == "T5"):
            #DEBEMOS BUSCAR TODAS LAS ASIGNACIONES DE LA RONDA EN ESPECIFICO
            arrayAsignacionesRondasAux = []
            for asig in self.asignaciones:
                if ronda == asig.numeroRonda:
                    arrayAsignacionesRondasAux.append(asig)

            # CALCULAMOS TODAS LAS FICHAS DEL CLUB AZUL RETIRADAS EN LA RONDA
            # ACA LOS JUGADORES PUEDEN PERTENECEER AL CLUB AMARILLO, SOLO SE TOMAN EN CUENTA LOS QUE PERTENECEN AL CLUB AZUL
            auxFichasClub = 0
            cantidadAmarillos = 0
            for asigAux in arrayAsignacionesRondasAux:
                if asigAux.club == "AZUL":
                    auxFichasClub = auxFichasClub + asigAux.fichasClub
                else:
                    auxFichasClub = auxFichasClub + asigAux.fichasClub
                    cantidadAmarillos = cantidadAmarillos + 1

            # AHORA DEBEMOS ASIGNAR EL COSTO DE MONITOREO PARA CADA UNA DE LAS ASIGNACIONES
            cm = cantidadAmarillos * self.costoDeMonitoreo
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.costoDeMonitoreo = cm

            # AHORA DEBEMOS SETEAR LAS FICHAS DEL RETIRO DEL CLUB Y CALCULAR LAS GANACIAS EXPERIMENTALES
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.fichasRetiroTotalClubAzul = auxFichasClub
                asigAux.calcularGanancias()
            
            for asigAux in arrayAsignacionesRondasAux:
                asigAux.fiscalizar()
    
    def sonTodosAmarillos(self):
        for j in self.jugadores:
            if j.club == "AZUL":
                return False 
        return True

try:
    f = open("fileJugadoresManager", "rb")
    print("abriendo")
    jugadoresManager = pickle.load(f)
    f.close()
except:
    print("creando fichero")
    arrayTrat = []
    #  (self, tratamiento: str, costoDeMonitoreo: str, esPrueba, rondas : int , porcentajeVigilancia : int, factorConversion: int
    t1 = Tratamiento("T4",2, True, 3, 50, 15)
    arrayTrat.append(t1)
    t1 = Tratamiento("T4",2, False, 10, 50, 15)
    arrayTrat.append(t1)
    t1 = Tratamiento("T4",2, False, 10, 50, 15)
    arrayTrat.append(t1)
    t1 = Tratamiento("T4",2, False, 10, 50, 15)
    arrayTrat.append(t1)
    jugadoresManager = JugadoresManager(4500, dictParticipantes, arrayTrat) 
    jugadoresManager.crearJugadoresGrupo1()
    
    fileCreated = open("fileJugadoresManager", "x")
    f = open("fileJugadoresManager", "wb")
    pickle.dump(jugadoresManager,f)
    f.close()

def guardarEstadoApp(objJugadoresManager):
    f = open("fileJugadoresManager", "wb")
    pickle.dump(objJugadoresManager,f)
    f.close()

manager = ConnectionManager()


@app.websocket("/ws/{client_id}")

async def websocket_endpoint(websocket: WebSocket, client_id: str):
    if(manager.existeConeccion(client_id)):
        return
    
    await manager.connect(websocket,client_id)
    now = datetime.now()
    current_time = now.strftime("%H:%M")
    message = {"time":current_time,"clientId":client_id,"message":"Online"}
    data = {"event" : json.dumps(message), "usersOnline": manager.getJsonUsers()}
    await manager.broadcast(json.dumps(data))
    try:
        while True:
            data = await websocket.receive_text()
            dataJson = json.loads(data)
            tipoConsulta = dataJson["tipo"]
            global ficheroBinario
            global jugadoresManager

            if(tipoConsulta == "AUX_ENVIAR_ENCUESTA"):
                print("Recibiendo encuesta")
                dataEncuesta = json.loads(dataJson['data'])

                grupo = dataEncuesta['grupo']
                integrante = dataEncuesta['integrante']
                genero = dataEncuesta['selectGenero']
                edad = dataEncuesta['selectEdad']
                universidad = dataEncuesta['selectUniversidad']
                carrera = dataEncuesta['selectCarrera']
                anoCursando = dataEncuesta['selectCursando']
                anoEsperaTenerCumplidoRequisitos = dataEncuesta ['selectEsperaTenerCumplidos'] 
                ingresoFamilia = dataEncuesta['ingresoFamilia']
                integrantesFamilia = dataEncuesta['selectIntegrantesFamilia']
                perteneceAlgunClub = dataEncuesta['perteneAClub']
                reelevanteClub = dataEncuesta['reelevanteClub']
                enc = Encuesta(grupo,integrante,genero,edad,universidad,carrera,anoCursando,anoEsperaTenerCumplidoRequisitos,ingresoFamilia,integrantesFamilia,perteneceAlgunClub,reelevanteClub)
                
                jugadoresManager.encuestas.append(enc)
                jugadoresManager.encuestaRecibida(integrante)

                # guardamos el binario
                guardarEstadoApp(jugadoresManager)

                if jugadoresManager.hanEncuestadoTodos():
                    print("Ahora procedemos a exportar las encuestas")
                    jugadoresManager.exportarEncuestasACSV()

                    jugadoresManager.vistaActual = "FINALIZAR_SESION_AGRADECIMIENTOS"
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)

                    # guardamos el binario
                    guardarEstadoApp(jugadoresManager)

   
            if(tipoConsulta == "AUX_COMENZAR_SIGUIENTE_ACTIVIDAD"):

                if(jugadoresManager.existeSiguienteActividad()):
                    # ACA DEBEMOS INICIAR LA SIGUIENTE ACTIVIDAD
                    jugadoresManager.siguienteActividad()
                    jugadoresManager.vistaActual = "ASIGNAR_CREDITOS"
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)

                    # guardamos el binario
                    guardarEstadoApp(jugadoresManager)
                else:
                    print("no existe siguiente actividad")

            if(tipoConsulta == "AUX_COMENZAR_ENCUESTA"):
                
                if jugadoresManager.vistaActual == "MOSTRAR_ENCUESTA":
                    print("No se puede iniciar la encuesta nuevamente")
                else:
                    jugadoresManager.vistaActual = "MOSTRAR_ENCUESTA"
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase()
                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)

                    # guardamos el binario
                    guardarEstadoApp(jugadoresManager)
                

            
            # Acciones del Admin
            if(tipoConsulta == "CLIENTE_SOLICITAR_VISTA"):
                data = dataJson["data"]
                cliente = data['cliente']
                # DEBEMOS SOLICITAR EL CLIENTE Y VERIFICAR SI HA RESPONDIDO O NO PARA 
                print(jugadoresManager.vistaActual)
                print(jugadoresManager.numeroTratamiento)
                print(len(jugadoresManager.tratamientos))

                if jugadoresManager.vistaActual == "FINALIZAR_SESION_AGRADECIMIENTOS":
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)

                if jugadoresManager.vistaActual == "MOSTRAR_ENCUESTA":
                    # HAY QUE VER SI ESTA BLOQUEADA O NO
                    if jugadoresManager.haEntregadoEncuesta(cliente):
                        print("mostando encuesta bloqueada")
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": True,
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.broadcastClients(jsonSend)

                    else:
                        print("mostando encuesta desbloqueada")
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": False,
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.broadcastClients(jsonSend)

                if jugadoresManager.vistaActual == "BIENVENIDO":
                    # HA HECHO CLICK EN EL BOTON, DEBEMOS RETORNAR PERO CON EL BOTON PERO BLOQUEADO
                    print(cliente)
                    if jugadoresManager.haIniciado(cliente):
                        #DEBEMOS RETIRNAR LA VISTA PERO BLOQUEADA
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": True,
                            "info": jugadoresManager.getInfoFase()
                            
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.send_personal_message(jsonSend, websocket)
                    
                    else:
                        #QUIERE DECIR QUE AUN NO HA VOTADO
                        # DEBEMOS RETORNAR LA VISTA PERO NO BLOQUEADA
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": False,
                            "info": jugadoresManager.getInfoFase()
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.send_personal_message(jsonSend, websocket)


                if jugadoresManager.vistaActual == "ASIGNAR_CREDITOS":

                    #DEBEMOS VERIFICAR SI EL CLIENTE HA ASIGNADO SUS FICHAS
                    if jugadoresManager.haAsignadoFichas(cliente):
                        # DEBEMOS RETORNAR LA VISTA PERO BLOQUEADA
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": True,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase()
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.send_personal_message(jsonSend, websocket)
                    else:
                        #QUIERE DECIR QUE AUN NO HA VOTADO
                        # DEBEMOS RETORNAR LA VISTA PERO NO BLOQUEADA
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": False,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase()
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.send_personal_message(jsonSend, websocket)

                if jugadoresManager.vistaActual == "MOSTRAR_RESULTADOS_RONDA_Y_VOTACION":
                    #DEBEMOS VERIFICAR CON EL ARRAY DE VOTACION
                    if cliente in jugadoresManager.arrayParticipantesDinamicoVotacion:
                        #QUIERE DECIR QUE AUN NO HA VOTADO
                        # DEBEMOS RETORNAR LA VISTA PERO NO BLOQUEADA
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": False,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase(),
                            "mostrarVotacion": True
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.send_personal_message(jsonSend, websocket)
                    else: 
                        #DEBEMOS RETIRNAR LA VISTA PERO BLOQUEADA
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": True,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase(),
                            "mostrarVotacion": True
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.send_personal_message(jsonSend, websocket)

                # ESTA VISTA NO SE DEBERIA MOSTRAR AL MOMENTO DE RECARGAR LA PAG 
                # PORQUE ESTA VISTA SOLO VA A DURAR UNOS POCOS SEGUNDOS
                if jugadoresManager.vistaActual == "MOSTRAR_RESULTADOS_VOTACION":
                    #DEBEMOS TENER UN ARRAY DE NOTIFICACIONES 
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.send_personal_message(jsonSend, websocket)

                if jugadoresManager.vistaActual == "MOSTRAR_FINALIZAR_ACTIVIDAD":
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                        "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)
                
                if jugadoresManager.vistaActual == "MOSTRAR_FINALIZAR_ACTIVIDAD_PRUEBA":
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                        "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()

                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)

                if jugadoresManager.vistaActual == "MOSTRAR_FINALIZAR_SESION":
                    mensaje = {
                        "action": jugadoresManager.vistaActual,
                        "bloqueado": False,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                        "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                    } 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)
                
            if(tipoConsulta == "CLIENTE_INICIAR_BLOQUES_TRATAMIENTO"):
                data = dataJson["data"]
                cliente = data['cliente']

                jugadoresManager.iniciarFase(cliente)

                # guardamos el binario
                guardarEstadoApp(jugadoresManager)

                if jugadoresManager.hanIniciadoTodos():
                    jugadoresManager.formatearArrayBienvenido()
                    jugadoresManager.vistaActual = "ASIGNAR_CREDITOS"

                    #guardamos el binario
                    guardarEstadoApp(jugadoresManager)

                    mensaje = {
                    "to":"Clientes",
                    "action": jugadoresManager.vistaActual,
                    "rondaActual": jugadoresManager.rondaActual,
                    "rondasTotales": jugadoresManager.rondasTotales,
                    "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                    "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                    "info": jugadoresManager.getInfoFase()
                    }
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)

            if(tipoConsulta == "CLIENTE_ENVIAR_FICHAS"):
                ## RECIBIENDO LAS FICHAS DE UN INTEGRANTE 
                data = dataJson["data"]
                # ACA DEBEMOS GUARDAR LOS DATOS ENTREGADOS POR EL USUARIO
                cliente = data['cliente']
                club = data['club']
                ronda = jugadoresManager.rondaActual
                fichasClub = data['fichasClub']
                fichasActividadPrivada = data['fichasActividadPrivada']

                # AÑADIMOS LA ASIGNACION CORRESPONDIENTE
                jugadoresManager.addAsignacionJugador(cliente,ronda,fichasClub, fichasActividadPrivada, club)

                # guardamos el binario
                guardarEstadoApp(jugadoresManager)

                #ACA DEBEMOS CHECKEAR SI TODOS HAN ENTREGADOS LOS DATOS Y PASAR A LA SIGUIENTE VIEW CON BROADCAST
                if jugadoresManager.hanAsignadoTodos():
                    # HACEMOS EL CALCULO DE TODAS LAS FICHAS ENTREGADAS
                    jugadoresManager.calcularPesosExperimentalesRonda(ronda)
                    jugadoresManager.siguienteRonda()
                    # guardamos el binario
                    guardarEstadoApp(jugadoresManager)

                    # ACA DEBERIAMOS MOSTRAR LA IMAGEN CON EL RETIRO QUE NECESITAMOS
                    jugadoresManager.vistaActual = "RESUMEN_ASIGNACION_CREDITOS"
                    mensaje = {
                        "to":"Clientes",
                        "action": jugadoresManager.vistaActual,
                        "rondaActual": jugadoresManager.rondaActual,
                        "rondasTotales": jugadoresManager.rondasTotales,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                        "info": jugadoresManager.getInfoFase(),
                        "asignaciones": jugadoresManager.exportarAsignaciones(),
                    }

                    # ACA DEBEMOS CALCULAR LA VOTACION Y QUIENES PUEDEN VOTAR 
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)
                    time.sleep(20)

                    
                    # ACA DEBEMOS MOSTRAR EL RESUMEN DE LA RONDA PERO SIN VOTAR Y PASAR A ASIGNAR FICHAS NUEVAMENTE
                    # DEBEMOS PREGUNTAR SI LA RONDA ES LA ULTIMA PARA FINALIZAR EL EXPERIMENTO
                    if jugadoresManager.tratamiento == "T1":
                        if jugadoresManager.esRondaFinal():
                            # ACA DEBEMOS MOSTRAR EL RESUMEN DE LA RONDA
                            jugadoresManager.vistaActual = "MOSTRAR_RESULTADOS_RONDA_Y_VOTACION"
                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)

                            mensaje = {
                            "to":"Clientes",
                            "action": jugadoresManager.vistaActual,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase()
                            }

                            # ACA DEBEMOS CALCULAR LA VOTACION Y QUIENES PUEDEN VOTAR 
                            jsonSend = json.dumps(mensaje)
                            await manager.broadcastClients(jsonSend)

                            time.sleep(10)
                            
                            # CONSULTAMOS SI ES LA ULTIMA ACTIVDAD
                            if jugadoresManager.existeSiguienteActividad():

                                if jugadoresManager.tratamientoDePrueba:
                                    ## aca debemos mostrar el final de la actividad
                                    jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_ACTIVIDAD_PRUEBA"

                                    jugadoresManager.guardarResultadosActividad()
                                    # guardamos el binario
                                    guardarEstadoApp(jugadoresManager)

                                    mensaje = {
                                        "action": jugadoresManager.vistaActual,
                                        "bloqueado": False,
                                        "rondaActual": jugadoresManager.rondaActual,
                                        "rondasTotales": jugadoresManager.rondasTotales,
                                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                        "info": jugadoresManager.getInfoFase(),
                                        "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                                    } 
                                    jsonSend = json.dumps(mensaje)
                                    await manager.broadcastClients(jsonSend)

                                else:
                                    ## aca debemos mostrar el final de la actividad
                                    jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_ACTIVIDAD"

                                    jugadoresManager.guardarResultadosActividad()
                                    # guardamos el binario
                                    guardarEstadoApp(jugadoresManager)

                                    mensaje = {
                                        "action": jugadoresManager.vistaActual,
                                        "bloqueado": False,
                                        "rondaActual": jugadoresManager.rondaActual,
                                        "rondasTotales": jugadoresManager.rondasTotales,
                                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                        "info": jugadoresManager.getInfoFase(),
                                        "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                                    } 
                                    jsonSend = json.dumps(mensaje)
                                    await manager.broadcastClients(jsonSend)


                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)
                                jugadoresManager.exportarFaseACsv()

                            else:
                                ## aca debemos mostrar el final de la fase
                                jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_SESION"

                                jugadoresManager.guardarResultadosActividad()
                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)

                                mensaje = {
                                    "action": jugadoresManager.vistaActual,
                                    "bloqueado": False,
                                    "rondaActual": jugadoresManager.rondaActual,
                                    "rondasTotales": jugadoresManager.rondasTotales,
                                    "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                    "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                    "info": jugadoresManager.getInfoFase(),
                                    "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                                } 
                                jsonSend = json.dumps(mensaje)
                                await manager.broadcastClients(jsonSend)

                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)
                                jugadoresManager.exportarFaseACsv()
                                jugadoresManager.exportarResultadosJugadoresCsv()
                            
                        else:
                            # ACA DEBEMOS MOSTRAR EL RESUMEN DE LA RONDA Y VOLVER A LA ASIGNACION DE FICHAS
                            jugadoresManager.vistaActual = "MOSTRAR_RESULTADOS_RONDA_Y_VOTACION"

                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)

                            mensaje = {
                            "to":"Clientes",
                            "action": jugadoresManager.vistaActual,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase()
                            }
                            jsonSend = json.dumps(mensaje)
                            await manager.broadcastClients(jsonSend)

                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)

                            time.sleep(10)
                        
                            ## aca debemos volver a la asignacion de los creditos
                            jugadoresManager.vistaActual = "ASIGNAR_CREDITOS"

                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)

                            mensaje = {
                                "action": jugadoresManager.vistaActual,
                                "bloqueado": False,
                                "rondaActual": jugadoresManager.rondaActual,
                                "rondasTotales": jugadoresManager.rondasTotales,
                                "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                "info": jugadoresManager.getInfoFase()
                            } 
                            # ACA DEBEMOS CALCULAR LA VOTACION Y QUIENES PUEDEN VOTAR 
                            jsonSend = json.dumps(mensaje)
                            await manager.broadcastClients(jsonSend)

                    # TRATAMIENTO T2 T3 T4 T5           
                    else:
                        if jugadoresManager.esRondaFinal():

                            if jugadoresManager.existeSiguienteActividad():

                                # ACA DEBEMOS MOSTRAR EL RESUMEN DE LA RONDA
                                jugadoresManager.vistaActual = "MOSTRAR_RESULTADOS_RONDA_Y_VOTACION"
                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)

                                # ES LA ULTIMA RONDA, POR ENDE NO SE DEBE VOTAR
                                mensaje = {
                                "to":"Clientes",
                                "action": jugadoresManager.vistaActual,
                                "rondaActual": jugadoresManager.rondaActual,
                                "rondasTotales": jugadoresManager.rondasTotales,
                                "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                "info": jugadoresManager.getInfoFase(),
                                "mostrarVotacion": False,
                                }
                                jsonSend = json.dumps(mensaje)
                                await manager.broadcastClients(jsonSend)

                                time.sleep(10)


                                if jugadoresManager.tratamientoDePrueba:
                                
                                    # SE DEBE MOSTRAR LA FINALIZACION DE LA ACTIVIDAD
                                    ## aca debemos mostrar el final de la fase
                                    jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_ACTIVIDAD_PRUEBA"
                                    jugadoresManager.guardarResultadosActividad()
                                    # guardamos el binario
                                    guardarEstadoApp(jugadoresManager)
                                    mensaje = {
                                        "action": jugadoresManager.vistaActual,
                                        "bloqueado": False,
                                        "rondaActual": jugadoresManager.rondaActual,
                                        "rondasTotales": jugadoresManager.rondasTotales,
                                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                        "info": jugadoresManager.getInfoFase(),
                                        "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()

                                    } 
                                    jsonSend = json.dumps(mensaje)
                                    await manager.broadcastClients(jsonSend)
                                
                                else:

                                    # SE DEBE MOSTRAR LA FINALIZACION DE LA ACTIVIDAD
                                    ## aca debemos mostrar el final de la fase
                                    jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_ACTIVIDAD"
                                    jugadoresManager.guardarResultadosActividad()
                                    # guardamos el binario
                                    guardarEstadoApp(jugadoresManager)
                                    mensaje = {
                                        "action": jugadoresManager.vistaActual,
                                        "bloqueado": False,
                                        "rondaActual": jugadoresManager.rondaActual,
                                        "rondasTotales": jugadoresManager.rondasTotales,
                                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                        "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                        "info": jugadoresManager.getInfoFase(),
                                        "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()

                                    } 
                                    jsonSend = json.dumps(mensaje)
                                    await manager.broadcastClients(jsonSend)

                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)
                                jugadoresManager.exportarFaseACsv()

                               
                            else:

                                # ACA DEBEMOS MOSTRAR EL RESUMEN DE LA RONDA
                                jugadoresManager.vistaActual = "MOSTRAR_RESULTADOS_RONDA_Y_VOTACION"
                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)

                                # ES LA ULTIMA RONDA, POR ENDE NO SE DEBE VOTAR, SOLO SE DEBE MOSTRAR Y FINALIZAR LA FASE
                                mensaje = {
                                "to":"Clientes",
                                "action": jugadoresManager.vistaActual,
                                "rondaActual": jugadoresManager.rondaActual,
                                "rondasTotales": jugadoresManager.rondasTotales,
                                "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                "info": jugadoresManager.getInfoFase(),
                                "mostrarVotacion": False,
                                }
                                jsonSend = json.dumps(mensaje)
                                await manager.broadcastClients(jsonSend)

                                time.sleep(10)
                                ## ACA DEBEMOS MOSTRAR EL FINAL DE LA SESION
                                jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_SESION"
                                jugadoresManager.guardarResultadosActividad()

                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)
                        
                                mensaje = {
                                    "action": jugadoresManager.vistaActual,
                                    "bloqueado": False,
                                    "rondaActual": jugadoresManager.rondaActual,
                                    "rondasTotales": jugadoresManager.rondasTotales,
                                    "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                    "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                    "info": jugadoresManager.getInfoFase(),
                                    "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                                } 
                                # ACA DEBEMOS CALCULAR LA VOTACION Y QUIENES PUEDEN VOTAR 
                                jsonSend = json.dumps(mensaje)
                                await manager.broadcastClients(jsonSend)

                                jugadoresManager.exportarFaseACsv()
                                jugadoresManager.exportarResultadosJugadoresCsv()

                        else:
                            jugadoresManager.vistaActual = "MOSTRAR_RESULTADOS_RONDA_Y_VOTACION"
                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)

                            mensaje = {
                            "to":"Clientes",
                            "action": jugadoresManager.vistaActual,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase(),
                            "mostrarVotacion": True,
                            }
                            jsonSend = json.dumps(mensaje)
                            await manager.broadcastClients(jsonSend)

                    jugadoresManager.formatearArrayAsignarFichas()
                    # guardamos el binario
                    guardarEstadoApp(jugadoresManager)
            
            if(tipoConsulta == "CLIENTE_ENVIAR_VOTACION"):
                ## RECIBIENDO LAS FICHAS DE UN INTEGRANTE 
                data = dataJson["data"]
                # ACA DEBEMOS GUARDAR LOS DATOS ENTREGADOS POR EL USUARIO
                cliente = data['cliente']
                votacion = data['votacion']
                club = data['club']
                
                ## Vemos si el tipo de voto es real o falso con el club
                if club == "AMARILLO":
                    jugadoresManager.votarEnFalso(cliente)
                else:
                    jugadoresManager.votar(cliente,votacion, jugadoresManager.rondaActual)

                # guardamos el binario
                guardarEstadoApp(jugadoresManager)

                #ACA DEBEMOS CHECKEAR SI TODOS HAN VOTADO Y PASAR A LA SIGUIENTE VIEW CON BROADCAST
                if jugadoresManager.hanVotadoTodos():

                    jugadoresManager.calcularVotacion()
                    # Formateamos el array para que puedan votar en la siguiente ronda
                    jugadoresManager.formatearArrayVotacion()
                    notificacionesRonda = jugadoresManager.getNotificaciones()
                    trasladosRonda = jugadoresManager.getTraslados()
                    jugadoresManager.vistaActual = "MOSTRAR_RESULTADOS_VOTACION"

                    # guardamos el binario
                    guardarEstadoApp(jugadoresManager)


                    # MOSTRAMOS LOS RESULTADOS DE LA VOTACION
                    mensaje = {
                        "to":"Clientes",
                        "action": jugadoresManager.vistaActual,
                        "notificaciones" : notificacionesRonda,
                        "traslados": trasladosRonda,
                        "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                        "info": jugadoresManager.getInfoFase()
                    }
                    jsonSend = json.dumps(mensaje)
                    await manager.broadcastClients(jsonSend)

                    # esperamos 10 segundos
                    time.sleep(10)

                    jugadoresManager.formatearNotificaciones()
                    jugadoresManager.formatearTraslados()
                    jugadoresManager.formatearArrayAsignarFichas()
                    # guardamos el binario
                    guardarEstadoApp(jugadoresManager)


                    ## ACA DEBEMOS VER SI ESTAN TODOS EN GRUPO AMARILLO Y PASAR A LA SIGUIENTE 
                    if jugadoresManager.sonTodosAmarillos():

                        #ACA DEBEMOS MOSTRAR LA IMAGEN DE QUE SE HA DILUIDO EL GRUPO AZUL
                        mensaje = {
                            "action": "ALERT_GRUPO_AZUL_ELIMINADO",
                        } 
                        jsonSend = json.dumps(mensaje)
                        await manager.broadcastClients(jsonSend)

                        ## DEBEMOS PASAR A LA SIGUIENTE ACTIVIDAD, SI ES LA ACTIVIDAD FINAL SE DEBE FINALZAR LA SESION 
                        if jugadoresManager.existeSiguienteActividad():

                            # SE DEBE MOSTRAR LA FINALIZACION DE LA ACTIVIDAD

                            if jugadoresManager.tratamientoDePrueba:
                                jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_ACTIVIDAD_PRUEBA"
                                jugadoresManager.guardarResultadosActividad()
                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)
                                mensaje = {
                                    "action": jugadoresManager.vistaActual,
                                    "bloqueado": False,
                                    "rondaActual": jugadoresManager.rondaActual,
                                    "rondasTotales": jugadoresManager.rondasTotales,
                                    "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                    "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                    "info": jugadoresManager.getInfoFase(),
                                    "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                                } 
                                jsonSend = json.dumps(mensaje)
                                await manager.broadcastClients(jsonSend)
                            else:
                                jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_ACTIVIDAD"
                                jugadoresManager.guardarResultadosActividad()
                                # guardamos el binario
                                guardarEstadoApp(jugadoresManager)
                                mensaje = {
                                    "action": jugadoresManager.vistaActual,
                                    "bloqueado": False,
                                    "rondaActual": jugadoresManager.rondaActual,
                                    "rondasTotales": jugadoresManager.rondasTotales,
                                    "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                    "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                    "info": jugadoresManager.getInfoFase(),
                                    "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                                } 
                                jsonSend = json.dumps(mensaje)
                                await manager.broadcastClients(jsonSend)

                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)
                            jugadoresManager.exportarFaseACsv()
                        
                        else:
                            ## ACA DEBEMOS MOSTRAR EL FINAL DE LA SESION
                            jugadoresManager.vistaActual = "MOSTRAR_FINALIZAR_SESION"
                            jugadoresManager.guardarResultadosActividad()

                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)
                        
                            mensaje = {
                                "action": jugadoresManager.vistaActual,
                                "bloqueado": False,
                                "rondaActual": jugadoresManager.rondaActual,
                                "rondasTotales": jugadoresManager.rondasTotales,
                                "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                                "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                                "info": jugadoresManager.getInfoFase(),
                                "resultadoJugadores": jugadoresManager.exportarTablaResultadosJugadores()
                            } 
                            jsonSend = json.dumps(mensaje)
                            await manager.broadcastClients(jsonSend)

                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)

                            jugadoresManager.exportarFaseACsv()
                            jugadoresManager.exportarResultadosJugadoresCsv()
                    
                    else:
                        # POR ESTE LADO ESTAMOS OK
                        ## ACA DEBEMOS VER SI ES T2 Y GEENRAR LAS ASIGNACIONES AUTOMATICAS DE LA SIGUIENTE RONDA
                        if jugadoresManager.tratamiento == "T2":
                            jugadoresManager.generarAsignacionesAutomaticas()

                            # guardamos el binario
                            guardarEstadoApp(jugadoresManager)
                    
                        ## aca debemos volver a la asignacion de los creditos
                        jugadoresManager.vistaActual = "ASIGNAR_CREDITOS"
                        # guardamos el binario
                        guardarEstadoApp(jugadoresManager)
                        mensaje = {
                            "action": jugadoresManager.vistaActual,
                            "bloqueado": False,
                            "rondaActual": jugadoresManager.rondaActual,
                            "rondasTotales": jugadoresManager.rondasTotales,
                            "jugadores": jugadoresManager.exportarTablaEstadoJugadores(),
                            "arrayTablasJugadores": jugadoresManager.exportarTablaRetirosJugadores(),
                            "info": jugadoresManager.getInfoFase()
                        }  
                        jsonSend = json.dumps(mensaje)
                        await manager.broadcastClients(jsonSend)

                    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        message = {"time":current_time,"clientId":client_id,"message":"Offline"}
        data = {"event" : json.dumps(message), "usersOnline": manager.getJsonUsers()}
        await manager.broadcast(json.dumps(data))

