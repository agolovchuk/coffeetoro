import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { locationSelector } from 'domain/routes';
import { AppState } from 'domain/StoreType';
import Layout from 'components/Layouts';

const mapStateToProps = (state: AppState) => ({
  location: locationSelector(state),
});

const mapDispatchToProps = {
  onBack: goBack,
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
