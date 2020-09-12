const { NavigationActions } = require("react-navigation")

class AppNavigation {
  static _navigationRef = null

  static Screens = {
    App: 'App'
  }
  
  static setNavigationRef = (ref) => {
    AppNavigation._navigationRef = ref
  }

  static navigate(routeName, params, action = {}) {
    AppNavigation._navigationRef.dispatch(
      NavigationActions.navigate({
        routeName,
          params,
          action,
        }
      )
    )
  }
}

export default AppNavigation