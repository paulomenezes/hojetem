package com.app.hojetem;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.KeyEvent;

import com.app.hojetem.BuildConfig;
import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.FacebookSdk;
import com.oblador.vectoricons.VectorIconsPackage;
import com.xxsnakerxx.socialauth.SocialAuthPackage;

import com.imagepicker.ImagePickerPackage;
import me.nucleartux.date.ReactDatePackage;

import com.burnweb.rnsimplealertdialog.RNSimpleAlertDialogPackage;

import com.oney.gcm.GcmPackage;
import io.neson.react.notification.NotificationPackage;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;
    private SocialAuthPackage mSocialAuthPackage;

    private ImagePickerPackage mImagePicker;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (android.os.Build.VERSION.SDK_INT > 9) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
        }

        mReactRootView = new ReactRootView(this);
        mSocialAuthPackage = new SocialAuthPackage(this);
        mImagePicker = new ImagePickerPackage(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new VectorIconsPackage())
                .addPackage(new ReactDatePackage(this))
                .addPackage(new RNSimpleAlertDialogPackage(this))
                .addPackage(new GcmPackage(this))
                .addPackage(new NotificationPackage(this))
                .addPackage(mSocialAuthPackage)
                .addPackage(mImagePicker)
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "socialAuthExample", null);

        setContentView(mReactRootView);

        FacebookSdk.sdkInitialize(getApplicationContext());
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        mSocialAuthPackage.handleActivityResult(requestCode, resultCode, data);
        mImagePicker.handleActivityResult(requestCode, resultCode, data);
    }
}
