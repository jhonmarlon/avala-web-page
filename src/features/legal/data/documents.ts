import { companyInfo } from '@/config/site'

export type LegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

export type LegalDocument = {
  label: string
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

const { name, legalName, nit, address, phone, email } = companyInfo
const site = 'avalagroup.net'
const updated = '29 de octubre de 2026'

// Ley 1581 de 2012 y Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015).
// Describe lo que el sitio hace hoy: si se agregan analítica, cookies o nuevos proveedores, actualizar este texto.
export const privacyPolicy: LegalDocument = {
  label: 'Privacidad',
  title: 'Política de tratamiento de datos personales',
  updated,
  intro: `${legalName} ("${name}") respeta la privacidad de quienes visitan ${site}. Esta política explica qué datos personales recopilamos a través del sitio, para qué los usamos y cómo podés ejercer tus derechos, conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas colombianas de protección de datos.`,
  sections: [
    {
      title: 'Responsable del tratamiento',
      items: [
        `Razón social: ${legalName} (${name}).`,
        `NIT: ${nit}.`,
        `Domicilio: ${address}.`,
        `Correo electrónico: ${email}.`,
        `Teléfono: ${phone}.`,
      ],
    },
    {
      title: 'Datos que recopilamos',
      paragraphs: ['Solo recopilamos los datos que nos entregás voluntariamente y los mínimos técnicos para operar el sitio de forma segura:'],
      items: [
        'Formulario de contacto: nombre, correo electrónico, empresa, teléfono (opcional), servicios de interés y el mensaje que escribas.',
        'Estimador de proyectos: nombre, correo electrónico, empresa y teléfono (opcionales), junto con las respuestas sobre tu proyecto y la estimación resultante.',
        'Datos técnicos: dirección IP, tipo de navegador, fecha y hora de acceso, registrados por el servidor para seguridad, prevención de abuso y diagnóstico de errores.',
      ],
    },
    {
      title: 'Datos sensibles y menores de edad',
      paragraphs: [
        'No solicitamos datos sensibles (como origen racial, salud, orientación sexual, creencias o datos biométricos). Te pedimos no incluirlos en tus mensajes.',
        'El sitio está dirigido a empresas y personas mayores de edad. No recopilamos de forma intencional datos de niñas, niños y adolescentes.',
      ],
    },
    {
      title: 'Finalidades del tratamiento',
      items: [
        'Responder tus consultas y solicitudes de contacto.',
        'Preparar y enviarte propuestas técnicas y económicas a partir del estimador.',
        'Hacer seguimiento comercial de tu solicitud, siempre relacionado con los servicios por los que preguntaste.',
        'Proteger el sitio frente a spam, fraude y ataques, y mantener su funcionamiento.',
        'Cumplir obligaciones legales y atender requerimientos de autoridades competentes.',
      ],
    },
    {
      title: 'Autorización',
      paragraphs: [
        'Al enviar cualquiera de los formularios del sitio autorizás de manera previa, expresa e informada el tratamiento de tus datos para las finalidades descritas en esta política.',
        'Podés revocar esta autorización en cualquier momento escribiendo a nuestro correo, salvo que exista un deber legal o contractual que nos obligue a conservar los datos.',
      ],
    },
    {
      title: 'Cookies y almacenamiento en el navegador',
      paragraphs: [
        'El sitio no utiliza cookies de analítica, publicidad ni seguimiento.',
        'Usamos el almacenamiento de sesión del navegador (sessionStorage) únicamente para recordar que ya viste la animación de entrada; se borra al cerrar la pestaña y no contiene datos personales.',
        'Las tipografías se cargan desde Google Fonts, por lo que tu navegador se conecta a servidores de Google, que pueden registrar tu dirección IP según sus propias políticas.',
      ],
    },
    {
      title: 'Con quién compartimos los datos',
      paragraphs: ['No vendemos ni alquilamos tus datos. Solo los compartimos con proveedores que nos prestan servicios y actúan como encargados del tratamiento:'],
      items: [
        'Google (Google Workspace): recepción y gestión del correo electrónico donde llegan los formularios.',
        'Hostinger: alojamiento del servidor donde funciona el sitio.',
        'WhatsApp (Meta): solo si elegís contactarnos por WhatsApp; en ese caso el mensaje se envía desde tu propia cuenta y se rige por las políticas de WhatsApp.',
      ],
    },
    {
      title: 'Transferencia internacional',
      paragraphs: [
        'Algunos de estos proveedores almacenan información en servidores ubicados fuera de Colombia. Trabajamos con proveedores que ofrecen niveles adecuados de protección de datos, y al aceptar esta política autorizás dicha transferencia o transmisión.',
      ],
    },
    {
      title: 'Tus derechos',
      paragraphs: ['Como titular de los datos tenés derecho a:'],
      items: [
        'Conocer, actualizar y rectificar tus datos personales.',
        'Solicitar prueba de la autorización otorgada.',
        'Ser informado sobre el uso que le damos a tus datos.',
        'Revocar la autorización y solicitar la supresión de tus datos cuando no exista un deber legal o contractual de conservarlos.',
        'Acceder gratuitamente a tus datos personales.',
        'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la normativa, una vez agotado el trámite ante nosotros.',
      ],
    },
    {
      title: 'Cómo ejercer tus derechos',
      paragraphs: [
        `Escribinos a ${email} con el asunto "Datos personales", indicando tu nombre, el medio para responderte y tu solicitud. Podremos pedirte información adicional para verificar tu identidad.`,
        'Las consultas se responden en un plazo máximo de diez (10) días hábiles, prorrogable por cinco (5) días hábiles más. Los reclamos se atienden en un plazo máximo de quince (15) días hábiles, prorrogable por ocho (8) días hábiles más, de acuerdo con los artículos 14 y 15 de la Ley 1581 de 2012.',
      ],
    },
    {
      title: 'Seguridad',
      paragraphs: [
        'Aplicamos medidas técnicas y organizativas razonables para proteger tus datos: conexión cifrada (HTTPS), acceso restringido al servidor y al correo, y controles contra envíos automatizados. Ningún sistema es completamente infalible, pero trabajamos para reducir los riesgos.',
      ],
    },
    {
      title: 'Conservación',
      paragraphs: [
        'Conservamos los datos de contacto y de las solicitudes mientras sean necesarios para atenderlas y para la relación comercial que se derive, y durante los plazos que exija la ley. Los registros técnicos del servidor se conservan por un tiempo limitado con fines de seguridad.',
      ],
    },
    {
      title: 'Cambios a esta política',
      paragraphs: [
        'Podemos actualizar esta política para reflejar cambios en el sitio o en la normativa. La versión vigente siempre estará publicada en esta página con su fecha de actualización. Si los cambios son sustanciales, lo informaremos por los medios disponibles.',
      ],
    },
  ],
}

export const termsOfUse: LegalDocument = {
  label: 'Términos',
  title: 'Términos y condiciones de uso',
  updated,
  intro: `Estos términos regulan el uso del sitio ${site}, operado por ${legalName} ("${name}"). Al navegar o usar el sitio aceptás estos términos; si no estás de acuerdo, te pedimos no utilizarlo.`,
  sections: [
    {
      title: 'Sobre nosotros',
      paragraphs: [
        `${name} es la marca comercial de ${legalName}, identificada con NIT ${nit}, con domicilio en ${address}. Podés contactarnos en ${email} o al ${phone}.`,
      ],
    },
    {
      title: 'Uso permitido',
      paragraphs: ['Te comprometés a usar el sitio de forma lícita y de buena fe. No está permitido:'],
      items: [
        'Enviar información falsa, de terceros sin su autorización, o contenido ofensivo o ilegal a través de los formularios.',
        'Enviar mensajes masivos, publicidad no solicitada o usar herramientas automatizadas para completar formularios.',
        'Intentar acceder sin autorización al servidor, interferir con el funcionamiento del sitio o vulnerar sus medidas de seguridad.',
        'Copiar, extraer o reutilizar de forma masiva el contenido del sitio.',
      ],
    },
    {
      title: 'Estimador de proyectos',
      paragraphs: [
        'Los rangos de tiempo, complejidad e inversión que muestra el estimador son orientativos y se calculan automáticamente a partir de tus respuestas. No constituyen una oferta, cotización ni compromiso contractual.',
        'El alcance, el precio y los plazos definitivos de cualquier proyecto se establecen únicamente en una propuesta formal o contrato firmado por ambas partes.',
      ],
    },
    {
      title: 'Contenido e información del sitio',
      paragraphs: [
        'La información sobre servicios, productos, casos de éxito y métricas tiene fines informativos y puede cambiar sin previo aviso. Hacemos lo posible para que sea precisa y actual, pero no garantizamos que esté libre de errores u omisiones.',
        'Los productos y servicios que contrates con nosotros se rigen por sus propias condiciones comerciales y contratos, que prevalecen sobre estos términos.',
      ],
    },
    {
      title: 'Propiedad intelectual',
      paragraphs: [
        `Los textos, diseños, logotipos, gráficos, animaciones, código y demás elementos del sitio son propiedad de ${legalName} o se usan con autorización de sus titulares, y están protegidos por las normas de propiedad intelectual. No se concede ninguna licencia sobre ellos por el solo hecho de usar el sitio.`,
        'Las marcas y logotipos de terceros que aparecen en el sitio pertenecen a sus respectivos dueños.',
      ],
    },
    {
      title: 'Enlaces a sitios de terceros',
      paragraphs: [
        'El sitio incluye enlaces a servicios de terceros, como WhatsApp, LinkedIn o Instagram. No controlamos esos sitios ni somos responsables por su contenido o sus prácticas de privacidad; su uso se rige por sus propios términos.',
      ],
    },
    {
      title: 'Disponibilidad y responsabilidad',
      paragraphs: [
        'El sitio se ofrece "tal como está". Trabajamos para que esté disponible y funcione correctamente, pero no garantizamos que opere sin interrupciones o errores, y podemos modificarlo, suspenderlo o retirarlo en cualquier momento.',
        'En la medida permitida por la ley, no somos responsables por daños derivados del uso o la imposibilidad de uso del sitio, ni por decisiones tomadas únicamente con base en su contenido o en los resultados del estimador.',
      ],
    },
    {
      title: 'Datos personales',
      paragraphs: ['El tratamiento de los datos que nos entregás a través del sitio se rige por nuestra Política de tratamiento de datos personales.'],
    },
    {
      title: 'Modificaciones',
      paragraphs: [
        'Podemos actualizar estos términos en cualquier momento. La versión vigente estará publicada en esta página con su fecha de actualización, y el uso del sitio después de un cambio implica su aceptación.',
      ],
    },
    {
      title: 'Ley aplicable',
      paragraphs: [
        'Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se someterá a los jueces competentes de la ciudad de Medellín, sin perjuicio de los derechos que te otorgue la normativa de protección al consumidor.',
      ],
    },
  ],
}
