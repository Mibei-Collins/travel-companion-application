import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1), minWidth: 120, marginBottom: '30px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  loading: {
    height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  container: {
    padding: '25px',
  },
  marginBottom: {
    marginBottom: '30px',
  },
  list: {
    height: '95vh', overflow: 'auto',
  },
  cuisineButton: {
    fontSize: '14px',
    margin: '5px',
    textTransform: 'capitalize',
    backgroundColor: '#A5DBDD',
    color: 'black',
    '&:hover': {
      backgroundColor: '#407C87',
    },
  },
  selectedCuisineButton: {
    backgroundColor: '#407C87',
  },
}));
