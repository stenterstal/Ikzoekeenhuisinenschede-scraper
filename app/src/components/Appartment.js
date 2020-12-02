import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCalendar, faClock, faCheck} from '@fortawesome/free-solid-svg-icons'

function Appartment(props){
    return(
        <div style={
            props.appartment.new === "true" ? {...styles.container, ...styles.success} : {...styles.container}
            // styles.container
        } onClick={() => window.open(props.appartment.href)}>
            <div style={styles.imageContainer}>
                <img src={props.appartment.img_href} style={styles.image} alt={"Appartment"}/>
                <div style={styles.priceContainer}>
                    <p style={styles.price}>€{props.appartment.price}</p>
                </div>
            </div>
            <div style={styles.mainContainer}>
                <h1 style={styles.adress}>{props.appartment.adress}</h1>
                <p><FontAwesomeIcon icon={faHome}/> {props.appartment.supplier}</p>
                <p><FontAwesomeIcon icon={faCalendar}/> {props.appartment.drawingdate}</p>
            </div>
            <div style={styles.drawedContainer}>
                {props.appartment.drawing_rank === null ?
                    <p><FontAwesomeIcon icon={faClock}/> Wachten op loting</p>
                :
                    (props.appartment.drawing_rank === -1
                            ?
                            <p><FontAwesomeIcon icon={faCheck} color={"#35de9d"}/> Geloot</p>
                            :
                            <p><FontAwesomeIcon icon={faCheck} color={"#35de9d"}/> Geloot op {props.appartment.drawing_rank}</p>
                    )
                }
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#222222',
        width: '23%',
        marginRight: '1%',
        marginBottom: '1%',
        borderRadius: 30,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        color: '#F2F2F2',
    },
    imageContainer: {
        width: '100%',
        height: '50%',
        position: 'relative',
    },
    image: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    priceContainer: {
        position: 'absolute',
        bottom: 0,
        width: '30%',
        height: '20%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 25,
    },
    price: {
        fontSize: 18,
        fontFamily: 'Roboto'
    },
    adress: {
        fontSize: 16,
        fontFamily: 'Roboto',
        flexShrink: 1,
        textAlign: 'center'
    },
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: 15
    },
    drawedContainer: {
        display: 'flex',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        justifyContent: 'center'
    },

    success: {
        border: '4px solid #35de9d',
    }
};

export default Appartment;
